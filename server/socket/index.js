const chalk = require('chalk')
const { History } = require('../db/models')
const remove = require('lodash/remove')
const {
  generateRandomNumbers,
  sumRandomNumbers
} = require('../modules/randomLargeSum')

const travellingSalesman = require('../modules/travellingSalesman')

// constants for job names
const HUGE_SUM = 'HUGE_SUM'
const TRAVELLING_SALESMAN = 'TRAVELLING_SALESMAN'
const TOGGLE_MULTITHREADED = 'TOGGLE_MULTITHREADED'

const rooms = {
  TRAVELLING_SALESMAN: {
    nodes: {},
    tasks: [],
    jobRunning: false,
    multiThreaded: false,
    start: null
  }
}
let finalResult = {
  tour: '',
  dist: Infinity
}

const getRoom = (object = {}) => {
  return object || {}
}

module.exports = (io) => {

  io.on('connection', (socket) => {
    console.log(`A socket connection to the server has been made: ${socket.id}`)

    // General purpose
    socket.on('join', (room) => {
      socket.join(room)
      if (!rooms[room]) {
        rooms[room] = {
          start: null,
          tasks: [],
          jobRunning: false,
          multiThreaded: false,
          nodes: { [socket.id]: { running: false, error: false } }
        }
      } else {
        rooms[room] = {
          start: rooms[room].start,
          jobRunning: rooms[room].jobRunning,
          multiThreaded: rooms[room].multiThreaded,
          tasks: rooms[room].tasks,
          nodes: {
            ...rooms[room].nodes,
            [socket.id]: { running: false, error: false }
          }
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

    // General purpose
    socket.on('leave', (room) => {
      socket.leave(room)
      delete rooms[room].nodes[socket.id]
      io.sockets.emit('UPDATE_' + room, getRoom(rooms[room]))
    })

    socket.on('start', (room) => {
      console.log(chalk.green('STARTING: ') + room, socket.id, room)
    })

    socket.on('done', ({ room, result, id, graph }) => {
      rooms[room].nodes[socket.id].running = false

      if (finalResult.dist > result[1]) {
        finalResult.tour = result[0]
        finalResult.dist = result[1]
      }

      console.log('result: ', result)
      console.log('running best: ', finalResult)

      // Check if more tasks
      // If more tasks get another
      // If not allDone = true
      const { tasks } = rooms[room]
      // console.log(tasks)
      const taskExists = tasks.some(task => task.id === id)
      if (taskExists) {
        rooms[room].tasks = remove(rooms[room].tasks, task => {
          return task.id !== id
        })
      }
      if (rooms[room].tasks.length > 0) {
        rooms[room].nodes[socket.id].running = true
        io.sockets.sockets[socket.id].emit(
          'CALL_' + room,
          rooms[room].tasks[0],
          graph,
          { multiThreaded: rooms[room].multiThreaded }
        )

        rooms[room].tasks = rooms[room].tasks.concat(rooms[room].tasks[0])
        rooms[room].tasks = rooms[room].tasks.slice(1)

        // console.log('AFTER: ' + rooms[room].tasks)
      }

      const allDone = Object.keys(rooms[room].tasks).length === 0
      // Object.keys(rooms[room].nodes)
      //   .every(socketId => rooms[room].nodes[socketId].running === false)

      if (allDone && rooms[room].jobRunning) {
        const endTime = Date.now()
        console.log(
          chalk.green(`DURATION OF ${room}: `, endTime - rooms[room].start)
        )

        console.log(
          chalk.magenta(`FINAL RESULT ${finalResult.tour} ${finalResult.dist}`)
        )

        io.sockets.emit('UPDATE_' + room, getRoom(rooms[room]))
        rooms[room].jobRunning = false

        History.create({
          nodes: Object.keys(rooms[room].nodes).length,
          result: finalResult.tour + ' ' + finalResult.dist,
          startTime: rooms[room].start,
          multiThreaded: rooms[room].multiThreaded,
          endTime,
          room
        })
          .then(() => {
            History.findAll({ where: { room } }).then((history) => {
              io.sockets.emit('UPDATE_HISTORY_' + room, history)
            })


            rooms[room].start = null
            finalResult = {
              tour: '',
              dist: Infinity
            }
          })
      }

      io.sockets.emit('UPDATE_' + room, getRoom(rooms[room]))
      console.log(chalk.green('DONE: '), socket.id, room)
    })

    socket.on('REQUEST_ROOM', (room) => {
      socket.emit('UPDATE_' + room, getRoom(rooms[room]))
    })

    socket.on(TOGGLE_MULTITHREADED, ({ room, value }) => {
      rooms[room].multiThreaded = value
      socket.emit('UPDATE_' + room, getRoom(rooms[room]))
    })

    socket.on('JOB_ERROR', (room) => {
      rooms[room].nodes[socket.id].running = false
      rooms[room].nodes[socket.id].error = true
      io.sockets.emit('UPDATE_' + room, getRoom(rooms[room]))
      console.log(chalk.red('JOB_ERROR: ') + `${room} for socket: ${socket.id}`)
    })

    // jobInit(HUGE_SUM, socket, io, (io, room) => {
    //   const socketsInRoom = io.sockets.adapter.rooms[HUGE_SUM].sockets
    //   Object.keys(socketsInRoom).forEach((id) => {
    //     io.sockets.sockets[id].emit('CALL_' + room, 13)
    //   })
    // })

    jobInit(
      TRAVELLING_SALESMAN,
      socket,
      io,
      travellingSalesman.partition
    )
  })
}

function jobInit(room, socket, io, partition) {
  const startName = 'START_' + room
  const callName = 'CALL_' + room


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
        partition(
          io,
          room,
          args, ((portions) => {

            rooms[room].tasks = (rooms[room].multiThreaded)
              ?
              portions.reduce((a, b, i) => {
                if (a[Math.floor(i / 4)]) a[Math.floor(i / 4)].value.push(b.value[0])
                else a[Math.floor(i / 4)] = b
                return a
              }, [])
              :
              portions.map(v => ({ id: v.id, value: v.value[0] }))

            Object.keys(rooms[room].nodes).forEach((id, i) => {
              io.sockets.sockets[id]
                .emit(
                callName,
                rooms[room].tasks[rooms[room].tasks.length - 1 - i],
                args,
                { multiThreaded: rooms[room].multiThreaded }
                )
            })
          })
        )
        rooms[room].running = false
      } else {
        console.log(chalk.red(`${startName} already running!`))
      }
    } else {
      console.log(chalk.red(`${startName} attempted without nodes`))
    }
  })
}
