const {
  History,
  Room,
  Selections,
  Parameters,
  Mutations
} = require('../db/models')
const { generateTasks } = require('./tasks')

class RoomManager {
  constructor(roomHash, socket) {
    this.room = roomHash
    this.nodes = {
      [socket.id]: {
        running: false,
        error: false
      }
    }
    this.tasks = []
    this.jobRunning = false
    this.start = null
    this.lastResult = null
    this.bucket = {}
    this.maxGen = null
    this.populationSize = null
    this.chromosomeLength = null
    this.fitnessGoal = null
    this.elitism = null
    this.fitness = null
    this.mutuations = null
    this.selection = null
    this.genePool = ['1', '0']
  }
  join(socket) {
    socket.join(this.room)
    this.nodes[socket.id] = { running: false, error: false }
  }
  leave(socket) {
    delete this.nodes[socket.id]
    socket.leave(this.room)
  }
  abort() {
    this.start = null
    this.tasks = []
    this.jobRunning = false
    this.multiThreaded = false
    this.bucket = {}
    this.nodes = {}
  }
  jobError(socket) {
    this.nodes[socket.id].running = false
    this.nodes[socket.id].error = true
  }
  isJobRunning() {
    return this.jobRunning
  }
  startJob() {
    this.jobRunning = true
    let mutations = this.mutations
    let selection = this.selection
    // generates 4X tasks for each node in the system
    this.tasks = generateTasks(
      this.populationSize,
      this.room,
      Object.keys(this.nodes).length * 4,
      this.fitness,
      mutations,
      selection,
      this.chromosomeLength,
      this.elitism
    )
  }
  mapPersistedToMemory(room) {
    // takes the room in the database, and maps its properties to the in room memory that the sockets use
    return Room.findOne({
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
      .then((roomFromDb) => {
      // Decycle and reshape mutations array because Sequelize isn't perfect
        const { mutations, ...rest } = JSON.parse(JSON.stringify(roomFromDb))
        const newMutations = mutations.map((mutation) => {
          mutation.chanceOfMutation = mutation.room_mutations.chanceOfMutation
          delete mutation.room_mutations
          return mutation
        })
        return { ...rest, mutations: newMutations }
      })
      .then(({ mutations, selection, parameters, fitnessFunc }) => {
        this.mutations = mutations
        this.selection = selection
        // Hack to make front end still work because it expects {function}
        this.fitness = { function: fitnessFunc }
        this.start = Date.now()
        this.totalFitness = 0
        this.chromosomesReturned = 0
        this.maxGen = parameters[0].generations
        this.populationSize = parameters[0].populationSize
        this.chromosomeLength = parameters[0].chromosomeLength
        this.elitism = parameters[0].elitism
        this.fitnessGoal = parameters[0].fitnessGoal
        Object.keys(this.nodes).forEach((socketId) => {
          this.nodes[socketId].running = true
          this.nodes[socketId].error = false
        })
        return this
      })
      .catch(err => console.err(err))
  }
  updateRoomStats(finishedTask) {
    this.totalFitness += finishedTask.fitnesses[0] + finishedTask.fitnesses[1]
    this.chromosomesReturned += finishedTask.population.length
  }
  updateBucket(finishedTask) {
    // if the room's bucket contains a task with the current incoming generation...
    if (this.bucket[finishedTask.gen]) {
      this.bucket[finishedTask.gen].population =
        this.bucket[finishedTask.gen].population.concat(finishedTask.population)
      this.bucket[finishedTask.gen].fitnesses =
        this.bucket[finishedTask.gen].fitnesses.concat(finishedTask.fitnesses)
    }
    // if not, make a new key in the bucket for the new incoming generation
    else {
      this.bucket[finishedTask.gen] = finishedTask
    }
  }
  shouldTerminate() {
    // right now this function doesn't do anything with the finishedTask,
    // but it will when we use elitism or a maxFitness
    return this.bucket[this.maxGen] && this.bucket[this.maxGen].population.length >= this.populationSize && this.isJobRunning()
  }
  finalSelection() {
    // takes the max generation and selects the most fit chromosome
    const finalGeneration = this.bucket[this.maxGen]
    const results = {}
    results.room = this.room

    let mostFit = finalGeneration.fitnesses[0]
    let mostFitChromosome = finalGeneration.population[0]

    for (let i = 0; i < finalGeneration.fitnesses.length; i++) {
      if (finalGeneration.fitnesses[i] > mostFit) {
        mostFit = finalGeneration.fitnesses[i]
        mostFitChromosome = finalGeneration.population[i]
      }
    }
    results.fitness = mostFit
    results.winningChromosome = mostFitChromosome
    return results
  }
  stopJob() {
    this.jobRunning = false
    // if the job is finished, each node stops running
    Object.keys(this.nodes).forEach((nodeId) => this.nodes[nodeId].running = false)

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
    this.start = null
    this.maxGen = null
    this.lastResult = {
      maxGeneration: 0,
      maxFitness: 0
    }
  }
  emptyTaskQueue() {
    this.tasks = []
  }
  totalTasks() {
    return this.tasks.length
  }
  // NEEDS TO GET RID OF ANY IO SOCKET CALLING
  distributeWork(socket,io) {
    this.nodes[socket.id].running = true
    // io.sockets.sockets[socket.id].emit(
    //   'CALL_' + finishedTask.room,
    //   rooms[finishedTask.room].tasks.shift(),
    // )
  }
  createMoreTasks(finishedTask) {
    if (this.bucket[finishedTask.gen].population.length >= this.populationSize) {
      this.tasks.push(this.bucket[finishedTask.gen])
      this.bucket[finishedTask.gen] = null
    } else {
      const newTask = generateTasks(
        this.populationSize,
        finishedTask.room,
        1,
        this.fitness,
        this.mutations,
        this.selection,
        this.chromosomeLength,
        this.genePool
      )
      this.tasks =
        this.tasks.concat(newTask)
    }
  }
  // directTraffic(finishedTask) {
  //   const allDone = this.shouldTerminate()
  //   const isJobRunning = this.isJobRunning()
  //   if (allDone && isJobRunning) {
  //     const results = this.finalSelection()
  //     algorithmDone(results.room, results.winningChromosome, results.fitness, io)
  //     this.emptyTaskQueue()
  //   } else if (isJobRunning) {
  //     if (this.totalTasks() > 0) {
  //       this.distributeWork(socket)
  //       // the following code below needs to be refactored and placed into functions
  //       io.sockets.sockets[socket.id].emit(
  //         'CALL_' + this.room,
  //         this.tasks.shift(),
  //       )
  //     }
  //     this.createMoreTasks(finishedTask)
  //   }
  // }
  async jobInit(socket, io, args) {
    const callName = 'CALL_' + this.room
    // takes the room stored in the database, and maps it to the in memory room
    const updatedRoom = await this.mapPersistedToMemory(this.room)
    io.to(this.room).emit('UPDATE_' + updatedRoom.room, this)
    // checks to see if the job is running already and if not, starts the job
    if (!this.isJobRunning()) {
      this.startJob()
      Object.keys(this.nodes).forEach((id, i) => {
        socket.broadcast.to(id).emit(callName, this.tasks.shift(), args)
      })
    } else {
      console.log(chalk.red(`${startName} already running!`))
    }
  }
}

module.exports = { RoomManager }
