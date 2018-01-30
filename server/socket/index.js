const chalk = require('chalk')
const {
  History,
  Room,
  Selections,
  Parameters,
  Mutations
} = require('../db/models')

const { generateTasks } = require('../modules/tasks')
const { finalSelection } = require('../modules/finalSelection')

// constants for job names
const TOGGLE_MULTITHREADED = 'TOGGLE_MULTITHREADED'

const rooms = {}

//you don't need both
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
      io
    )
    //dont be passing io around.
    //you can socket.broadcast.to(roomIdString)
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
  socket.on('JOB_ERROR', ({ roomHash, error }) => {
    rooms[roomHash].nodes[socket.id].running = false
    rooms[roomHash].nodes[socket.id].error = true
    io.sockets.emit('UPDATE_' + roomHash, getRoom(rooms[roomHash]))
    console.log(chalk.red('JOB_ERROR: ') + `${roomHash} for socket: ${socket.id}, `, error)
  })
}

function registerAbort(socket, io) {
  socket.on('ABORT', (room) => {
    rooms[room] = {
      start: null,
      tasks: [],
      jobRunning: false,
      multiThreaded: false,
      bucket: {},
      nodes: {}
    }

    io.sockets.emit('ABORT_' + room)
  })
}

//why is there no documentation or comments
function registerJoin(socket, io) {
  socket.on('join', (room) => {
    socket.join(room)
    //i don't think you need to create a room on every socket join event.
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
        maxGen: null,
        populationSize: null,
        chromosomeLength: null,
        fitnessGoal: null,
        elitism: null,
        fitness: null
      }
    } else {
      //rooms utility for pushing in a single node.
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

//
function registerRequestRoom(socket) {
  //idk, remember you can use event emitters if something is isolated on either FE or BE
  socket.on('REQUEST_ROOM', (room) => {
    socket.emit('UPDATE_' + room, getRoom(rooms[room]))
  })
}

function registerLeave(socket, io) {
  socket.on('leave', (room) => {
    socket.leave(room)
    delete rooms[room].nodes[socket.id]
    //socket.broadcast.to 
    io.sockets.emit('UPDATE_' + room, getRoom(rooms[room]))
  })
}

function registerStart(socket) {
  socket.on('start', (room) => {
    console.log(chalk.green('STARTING: ') + room, socket.id)
  })
}

function registerDone(socket, io) {
  socket.on('done', args => doneCallback(args, socket, io))
}

function doneCallback(args, socket, io) {
  if (rooms[args.room].nodes[socket.id]) {
    rooms[args.room].nodes[socket.id].running = false
  }

  if (!rooms[args.room].lastResult) {
    rooms[args.room].lastResult = {
      maxGeneration: 0,
      maxFitness: 0
    }
  }

  const maxFitness = Math.max(...args.fitnesses)

  if (rooms[args.room].lastResult.maxGeneration <= args.gen || rooms[args.room].lastResult.maxFitness <= maxFitness) {
    rooms[args.room].lastResult.maxGeneration = args.gen
    rooms[args.room].lastResult.maxFitness = maxFitness
  }

  if(args.fitnesses && args.fitnesses.length < 1) throw Error()

  rooms[args.room].totalFitness += (args.fitnesses[0] + args.fitnesses[1])
  rooms[args.room].chromesomesReturned += args.population.length

  /*
  updated control flow:
  1. Update bucket
  2. check all done
    all done === (a) the bucket at the max generation exists
                 (b) the bucket at the max generation is greater than or equal to full
    2.1 if all done and jobRunning, call finalSelection, call algorithmDone w/ results
    2.2 if not all done and jobRunning, call createTask

    see below:
  */

  updateBucket(args);
  const allDone = shouldTerminate(args);

  // Avoid pushing history multiple times by checking jobRunning
  if (allDone && rooms[args.room].jobRunning) {
    const results = finalSelection(args, rooms[args.room])
    algorithmDone(results.room, results.winningChromosome, results.fitness, io)
    rooms[args.room].tasks = []
  } else if (rooms[args.room].jobRunning) {
    if (rooms[args.room].tasks.length > 0) {
      rooms[args.room].nodes[socket.id].running = true
      io.sockets.sockets[socket.id].emit(
        'CALL_' + args.room,
        rooms[args.room].tasks.shift(),
        args.graph, {
          multiThreaded: rooms[args.room].multiThreaded
        }
      )
      // console.log('AFTER: ' + rooms[args.room].tasks)
    }
    createMoreTasks(args)
  }

  io.sockets.emit('UPDATE_' + args.room, getRoom(rooms[args.room]))
  console.log(chalk.green('DONE: '), socket.id, args.room)
}

function algorithmDone(room, winningChromosome, fitness, io) {
  const endTime = Date.now()
  console.log(
    chalk.green(`DURATION OF ${room}: `, endTime - room.start)
  )

  console.log(
    chalk.magenta(`BEST CHROMOSOME: ${winningChromosome}`)
  )

  console.log(
    chalk.magenta(`BEST FITNESS: ${fitness}`)
  )

  io.sockets.emit('UPDATE_' + room, getRoom(room))
  room.jobRunning = false
  // History.create({
  //   nodes: Object.keys(room.nodes).length,
  //   result: room.lastResult.tour + ' ' + room.lastResult.dist,
  //   startTime: room.start,
  //   multiThreaded: room.multiThreaded,
  //   endTime,
  //   room
  // })
  //   .then(() => {
  //     History.findAll({
  //       where: {
  //         room
  //       }
  //     }).then((history) => {
  //       io.sockets.emit('UPDATE_HISTORY_' + room, history)
  //     })
  //     rooms[room].start = null
  //     rooms[room].maxGen = null
  //     // rooms[room].populationSize = null
  //     rooms[room].lastResult = {
  //       maxGeneration: 0,
  //       maxFitness: 0
  //     }
  //   })
  room.start = null
  room.maxGen = null
  room.lastResult = {
    maxGeneration: 0,
    maxFitness: 0
  }
}

function jobInit(room, socket, io) {
  const startName = 'START_' + room
  const callName = 'CALL_' + room
  socket.on(startName, async (args) => {
    if (!rooms[room]) return
    Room.findOne({
      where: { roomHash: room || null },
      include: [{
        model: Parameters,
        through: {
          attributes: []
        }
      },
      {
        model: Selections,
        attributes: ['name', 'function']
      },
      {
        model: Mutations,
        attributes: ['function'],
        through: {
          attributes: ['chanceOfMutation']
        }
      }]
    })
      .then((room) => {
        // Decycle and reshape mutations array because Sequelize isn't perfect
        const { mutations, ...rest } = JSON.parse(JSON.stringify(room))
        const newMutations = mutations.map((mutation) => {
          mutation.chanceOfMutation = mutation.room_mutations.chanceOfMutation
          delete mutation.room_mutations
          return mutation
        })
        return { ...rest, mutations: newMutations }
      })
      .then(({ mutations, selection, parameters, fitnessFunc }) => {
        rooms[room].mutations = mutations
        rooms[room].selection = selection
        // Hack to make front end still work because it expects {function}
        rooms[room].fitness = { function: fitnessFunc }
        rooms[room].start = Date.now()
        rooms[room].jobRunning = true
        rooms[room].totalFitness = 0
        rooms[room].chromesomesReturned = 0
        rooms[room].maxGen = parameters[0].generations
        rooms[room].populationSize = parameters[0].populationSize
        rooms[room].chromosomeLength = parameters[0].chromosomeLength
        rooms[room].elitism = parameters[0].elitism
        rooms[room].fitnessGoal = parameters[0].fitnessGoal
        Object.keys(rooms[room].nodes).forEach((socketId) => {
          rooms[room].nodes[socketId].running = true
          rooms[room].nodes[socketId].error = false
        })

        io.sockets.emit('UPDATE_' + room, getRoom(rooms[room]))
        if (rooms[room]) {
          if (!rooms[room].running) {
            rooms[room].running = true
            // generates 4X tasks for each node in the system
            rooms[room].tasks = generateTasks(
              rooms[room].populationSize,
              room,
              Object.keys(rooms[room].nodes).length * 4,
              rooms[room].fitness,
              mutations,
              selection,
              rooms[room].chromosomeLength,
              rooms[room].elitism
            )

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
          } else {
            console.log(chalk.red(`${startName} already running!`))
          }
        } else {
          console.log(chalk.red(`${startName} attempted without nodes`))
        }
      })
  })
}

function updateBucket(finishedTask) {
  // if the room's bucket contains a task with the current incoming generation...
  if (rooms[finishedTask.room].bucket[finishedTask.gen]) {
    rooms[finishedTask.room].bucket[finishedTask.gen].population =
      rooms[finishedTask.room].bucket[finishedTask.gen].population.concat(finishedTask.population)
   rooms[finishedTask.room].bucket[finishedTask.gen].fitnesses = rooms[finishedTask.room].bucket[finishedTask.gen].fitnesses.concat(finishedTask.fitnesses)
  }
  // if not, make a new key in the bucket for the new incoming generation
  else {
    rooms[finishedTask.room].bucket[finishedTask.gen] = finishedTask
  }
}

function shouldTerminate(finishedTask) {
  // right now this function doesn't do anything with the finishedTask,
  // but it will when we use elitism or a maxFitness
  const room = rooms[finishedTask.room]
  return room.bucket[room.maxGen] && room.bucket[room.maxGen].population.length >= room.populationSize
}

function createMoreTasks(finishedTask) {
  if (rooms[finishedTask.room].bucket[finishedTask.gen].population.length >= rooms[finishedTask.room].populationSize) {
    rooms[finishedTask.room].tasks.push(rooms[finishedTask.room].bucket[finishedTask.gen])
    rooms[finishedTask.room].bucket[finishedTask.gen] = null
  } else {
    const newTask = generateTasks(
      rooms[finishedTask.room].populationSize,
      finishedTask.room,
      1,
      rooms[finishedTask.room].fitness,
      rooms[finishedTask.room].mutations,
      rooms[finishedTask.room].selection,
      rooms[finishedTask.room].chromosomeLength
    )

    rooms[finishedTask.room].tasks =
      rooms[finishedTask.room].tasks.concat(newTask)
  }
}
