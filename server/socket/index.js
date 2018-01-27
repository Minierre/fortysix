const chalk = require('chalk')
const {
  History,
  Fitness
} = require('../db/models')
const { generateTasks } = require('../modules/tasks')
const remove = require('lodash/remove')

const travellingSalesman = require('../modules/travellingSalesman')

// constants for job names
const TOGGLE_MULTITHREADED = 'TOGGLE_MULTITHREADED'

const rooms = {}

const getRoom = (object = {}) => {
  return object || {}
}

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)
    registerJoinAdmin(socket, io)
    registerEvents(socket, io)
  })
}

function registerJoinAdmin(socket, io) {
  socket.on('ADMIN_JOIN', (room) => {
    jobInit(
      room,
      socket,
      io,
      // This is where you put the magic
      generateTasks
    )
  })
}

function registerEvents(socket, io) {
  registerJoin(socket, io)
  registerLeave(socket, io)
  registerStart(socket, io)
  registerDone(socket, io)
  registerRequestRoom(socket, io)
  registerAbort(socket, io)
  registerMultithreaded(socket)
  registerJobError(socket, io)
}

function registerMultithreaded(socket) {
  socket.on(TOGGLE_MULTITHREADED, ({
    room,
    value
  }) => {
    rooms[room].multiThreaded = value
    socket.emit('UPDATE_' + room, getRoom(rooms[room]))
  })
}

function registerJobError(socket, io) {
  socket.on('JOB_ERROR', (room) => {
    rooms[room].nodes[socket.id].running = false
    rooms[room].nodes[socket.id].error = true
    io.sockets.emit('UPDATE_' + room, getRoom(rooms[room]))
    console.log(chalk.red('JOB_ERROR: ') + `${room} for socket: ${socket.id}`)
  })
}

function registerAbort(socket, io) {
  socket.on('ABORT', (room) => {

    rooms[room] = {
      start: null,
      tasks: [],
      jobRunning: false,
      multiThreaded: false,
      nodes: {}
    }

    io.sockets.emit('ABORT_' + room)
  })
}

function registerJoin(socket, io) {
  socket.on('join', (room) => {
    socket.join(room)
    if (!rooms[room]) {
      rooms[room] = {
        start: null,
        tasks: [],
        jobRunning: false,
        multiThreaded: false,
        nodes: {
          [socket.id]: {
            running: false,
            error: false
          }
        },
        bucket: {},
        lastResult: null,
      }
    } else {
      rooms[room] = {
        ...rooms[room],
        nodes: {
          ...rooms[room].nodes,
          [socket.id]: {
            running: false,
            error: false
          }
        },
      }
    }

    // General purpose
    socket.once('disconnect', () => {
      delete rooms[room].nodes[socket.id]
      socket.leave(room)
      io.sockets.emit('UPDATE_' + room, getRoom(rooms[room]))
    })
    io.sockets.emit('UPDATE_' + room, getRoom(rooms[room]))
  })
}

function registerRequestRoom(socket) {
  socket.on('REQUEST_ROOM', (room) => {
    socket.emit('UPDATE_' + room, getRoom(rooms[room]))
  })
}

function registerLeave(socket, io) {
  socket.on('leave', (room) => {
    socket.leave(room)
    delete rooms[room].nodes[socket.id]
    io.sockets.emit('UPDATE_' + room, getRoom(rooms[room]))
  })
}

function registerStart(socket) {
  socket.on('start', (room) => {
    console.log(chalk.green('STARTING: ') + room, socket.id, room)
  })
}

function registerDone(socket, io) {
  socket.on('done', args => doneCallback(args, socket, io))
}

function doneCallback(args, socket, io) {
  if (rooms[args.room].nodes[socket.id]) {
    rooms[args.room].nodes[socket.id].running = false
  }

  // TODO: Needs to be changed dramatically
  if (!rooms[args.room].lastResult) {
    rooms[args.room].lastResult = {
      maxGeneration: 0,
      maxFitness: 0
    }
  }

  // TODO: Change moderately
  const maxFitness = Math.max(...args.fitnesses)

  if (rooms[args.room].lastResult.maxGeneration <= args.gen || rooms[args.room].lastResult.maxFitness <= maxFitness) {
    rooms[args.room].lastResult.maxGeneration = args.gen
    rooms[args.room].lastResult.maxFitness = maxFitness
  }

  console.log('result: ', args.result)
  console.log('running best: ', rooms[args.room].lastResult)

  const {
    tasks
  } = rooms[args.room]

  // TODO: Needs to be changed dramatically
  const taskExists = tasks.some(task => task.id === args.id)
  if (taskExists) {
    rooms[args.room].tasks = remove(rooms[args.room].tasks, task => {
      return task.id !== args.id
    })
  }

  // TODO: Needs to be changed moderately
  if (rooms[args.room].tasks.length > 0) {
    rooms[args.room].nodes[socket.id].running = true
    io.sockets.sockets[socket.id].emit(
      'CALL_' + args.room,
      rooms[args.room].tasks[0],
      args.graph, {
        multiThreaded: rooms[args.room].multiThreaded
      }
    )

    rooms[args.room].tasks = rooms[args.room].tasks.concat(rooms[args.room].tasks[0])
    rooms[args.room].tasks = rooms[args.room].tasks.slice(1)

    // console.log('AFTER: ' + rooms[args.room].tasks)
  }

  // TODO: Needs to be changed DRAMATTICALLY
  const allDone = Object.keys(rooms[args.room].tasks).length === 0

  // TODO: Needs to be changed moderately
  if (allDone && rooms[args.room].jobRunning) {
    algorithmDone(args.room, io)
  }

  io.sockets.emit('UPDATE_' + args.room, getRoom(rooms[args.room]))
  console.log(chalk.green('DONE: '), socket.id, args.room)
}

function algorithmDone(room, io) {
  const endTime = Date.now()
  console.log(
    chalk.green(`DURATION OF ${room}: `, endTime - rooms[room].start)
  )

  console.log(
    chalk.magenta(`FINAL RESULT ${rooms[room].lastResult.tour} ${rooms[room].lastResult.dist}`)
  )

  io.sockets.emit('UPDATE_' + room, getRoom(rooms[room]))
  rooms[room].jobRunning = false

  // TODO: DRAMATIC CHANGE
  History.create({
    nodes: Object.keys(rooms[room].nodes).length,
    result: rooms[room].lastResult.tour + ' ' + rooms[room].lastResult.dist,
    startTime: rooms[room].start,
    multiThreaded: rooms[room].multiThreaded,
    endTime,
    room
  })
    .then(() => {
      History.findAll({
        where: {
          room
        }
      }).then((history) => {
        io.sockets.emit('UPDATE_HISTORY_' + room, history)
      })
      rooms[room].start = null
      rooms[room].lastResult = {
        tour: '',
        dist: Infinity
      }
    })
}

function jobInit(room, socket, io, generateTasks) {
  const startName = 'START_' + room
  const callName = 'CALL_' + room
  console.log('START NAME', startName)

  socket.on(startName, (args) => {

    if (!rooms[room]) return
    rooms[room].start = Date.now()
    rooms[room].jobRunning = true
    Object.keys(rooms[room].nodes).forEach((socketId) => {
      rooms[room].nodes[socketId].running = true
      rooms[room].nodes[socketId].error = false
    })

    io.sockets.emit('UPDATE_' + room, getRoom(rooms[room]))
    if (rooms[room]) {
      if (!rooms[room].running) {
        rooms[room].running = true
        // generates 4X tasks for each node in the system
        generateTasks(args, room, Object.keys(rooms[room].nodes).length * 4)
        .then(tasks => {
          rooms[room].tasks = tasks
          Object.keys(rooms[room].nodes).forEach((id, i) => {
            io.sockets.sockets[id]
              .emit(
                callName,
                rooms[room].tasks.shift(),
                args, {
                  multiThreaded: rooms[room].multiThreaded
                }
              )
          })
          rooms[room].running = false
        })
      } else {
        console.log(chalk.red(`${startName} already running!`))
      }
    } else {
      console.log(chalk.red(`${startName} attempted without nodes`))
    }
  })
}

