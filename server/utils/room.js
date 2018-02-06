const chalk = require('chalk')
const {
  History,
  Room,
  Selections,
  Parameters,
  Mutations
} = require('../db/models')
const { generateTasks } = require('./tasks')
const forEach = require('lodash/forEach')
const { RoomStats } = require('./stats')

class RoomManager {
  constructor(roomHash) {
    this.room = roomHash
    this.nodes = {}
    this.tasks = []
    this.jobRunning = false
    this.start = null
    this.lastResult = null
    this.bucket = {}
    this.maxGen = null
    this.populationSize = null
    this.chromosomeLength = null
    this.fitnessGoal = 0
    this.elitism = null
    this.reproductiveCoefficient = 1
    this.fitness = null
    this.mutations = null
    this.selection = null
    this.genePool = []
    this.admins = {}
    this.chromosomesReturned = 0
    this.totalFitness = 0
    this.roomStats = null
    this.totalTasksCompleted = 0
    this.isDone = false
  }

  getState() {
    return {
      room: this.room,
      nodes: this.nodes,
      tasks: this.tasks,
      jobRunning: this.jobRunning,
      start: this.start,
      lastResult: this.lastResult,
      bucket: this.bucket,
      maxGen: this.maxGen,
      populationSize: this.populationSize,
      chromosomeLength: this.chromosomeLength,
      fitnessGoal: this.fitnessGoal,
      elitism: this.elitism,
      reproductiveCoefficient: this.reproductiveCoefficient,
      fitness: this.fitness,
      mutations: this.mutations,
      selection: this.selection,
      genePool: this.genePool,
      admins: this.admins,
      chromosomesReturned: this.chromosomesReturned,
      totalFitness: this.totalFitness,
      roomStats: this.roomStats,
    }
  }

  addAdmin(socket) {
    this.admins[socket.id] = socket
  }

  join(socket) {
    socket.join(this.room)

    this.nodes[socket.id] = { ready: true, running: false, error: false, tasksCompletedByNode: 0 }
    if (this.jobRunning) {
      this.tasks = this.tasks.concat(generateTasks(
        this.populationSize,
        this.room,
        4,
        this.fitness,
        this.mutations,
        this.selection,
        this.chromosomeLength,
        this.genePool,
        this.elitism
      ))
        socket.emit('CALL_' + this.room, { isRunning: this.jobRunning, task: this.tasks.shift(), tasksCompletedByNode: this.nodes[socket.id].tasksCompletedByNode, totalTasksCompleted: this.totalTasksCompleted, isDone: this.isDone })
    this.updateAdmins()
  }
  }

  leave(socket) {
    delete this.nodes[socket.id]
    socket.leave(this.room)
    this.updateAdmins()
  }

  abort(socket) {
    console.log(chalk.red('JOB ABORTED: '), this.room)

    this.start = null
    this.tasks = []
    this.jobRunning = false
    this.multiThreaded = false
    this.bucket = {}
    this.nodes = {}
    this.updateAdmins()
    socket.broadcast.to(this.room).emit('ABORT_' + this.room)
  }

  jobError(socket, error) {
    this.nodes[socket.id].running = false
    this.nodes[socket.id].error = true
    // socket.broadcast.to(this.room).emit('UPDATE_' + this.room, this)
    console.log(`JOB_ERROR: ${this.room} for socket: ${socket.id}, `, error)
  }

  isJobRunning() {
    return this.jobRunning
  }

  startJob() {
    this.jobRunning = true
    // generates 4X tasks for each node in the system
    this.tasks = generateTasks(
      this.populationSize,
      this.room,
      Object.keys(this.nodes).length * 4,
      this.fitness,
      this.mutations,
      this.selection,
      this.chromosomeLength,
      this.genePool,
      this.reproductiveCoefficient,
      this.elitism
    )
  }

  mapPersistedToMemory(room) {
    // takes the room in the database, and maps its properties to the in room memory that the sockets use
    return Room.getRoomWithAssociations(
      room,
      Parameters,
      Selections,
      Mutations
    )
      .then(({ mutations, selection, parameters, fitnessFunc }) => {
        this.mutations = mutations
        this.selection = selection
        // Hack to make front end still work because it expects {function}
        this.fitness = { function: fitnessFunc }
        this.start = Date.now()
        this.totalFitness = 0
        this.chromosomesReturned = 0
        this.maxGen = parameters.generations
        this.populationSize = parameters.populationSize
        this.chromosomeLength = parameters.chromosomeLength
        this.elitism = parameters.elitism
        this.fitnessGoal = parameters.fitnessGoal
        this.reproductiveCoefficient = parameters.reproductiveCoefficient
        this.genePool = parameters.genePool.split(',')
        Object.keys(this.nodes).forEach((socketId) => {
          this.nodes[socketId].running = true
          this.nodes[socketId].error = false
        })
        return // empty return
      })
      .catch(err => console.error(err))
  }

  updateRoomStats(finishedTask) {
    this.totalFitness += finishedTask.fitnesses.reduce((a, b) => a + b, 0)
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
      delete this.bucket[finishedTask.gen].genOneFitnessData
    }
  }

  toggleNodeReady(socket){
    console.log('toggle node ready');
    if(this.nodes[socket.id]){
      console.log(this.nodes[socket.id]);
      if (this.nodes[socket.id].ready){
        this.nodes[socket.id].ready = false
      } else {
        this.nodes[socket.id].ready = true;
        this.distributeWork(socket)
      }
    }
  }

  shouldTerminate(fitnesses) {
    // checks the termination conditions and returns true if the job should stop
    return ((this.bucket[this.maxGen] && this.bucket[this.maxGen].population.length >= this.populationSize) || Math.max(...fitnesses) >= this.fitnessGoal) && this.isJobRunning()
  }

  totalTasks() {
    return this.tasks.length
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
    this.bucket = {}
    this.tasks = []
    return results
  }

  stopJob(socket) {
    this.jobRunning = false
    this.nodes[socket.id].ready = true;
    // if the job is finished, each node stops running
    Object.keys(this.nodes).forEach((nodeId) => {
      this.nodes[nodeId].running = false;
    })

    History.create({
      nodes: Object.keys(this.nodes).length,
      room: this.room,
      result: this.lastResult,
      startTime: this.start,
      endTime: new Date(),
    })
      .then(() => {
        History.findAll({
          where: {
            room: this.room
          }
        }).then((history) => {
          socket.broadcast.to(this.room).emit('UPDATE_HISTORY_' + this.room, history)
        })
        this.start = null
        this.lastResult = null
      })

    this.start = null
    this.maxGen = null
    this.lastResult = {
      maxGeneration: 0,
      maxFitness: 0
    }
  }

  emptyTaskQueue() {
    this.isDone = true;
    this.tasks = []
  }

  // NEEDS TO GET RID OF ANY IO SOCKET CALLING
  distributeWork(socket) {
    //check if 256 breaks something
    if (this.nodes[socket.id]) {
      if (this.nodes[socket.id].ready) {
      this.nodes[socket.id].running = true
      this.nodes[socket.id].error = false
      this.nodes[socket.id].tasksCompletedByNode++
        socket.emit('CALL_' + this.room, { task: this.tasks.shift(), tasksCompletedByNode: this.nodes[socket.id].tasksCompletedByNode, totalTasksCompleted: this.totalTasksCompleted, isDone: this.isDone })
      this.updateAdmins()
    }
    }
  }

  createTask(finishedTask) {
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
        this.genePool,
        this.reproductiveCoefficient
      )
      this.tasks =
        this.tasks.concat(newTask)
    }
  }

  addAdmin(socket) {
    this.admins[socket.id] = socket
  }

  async jobInit(socket, io) {

    const callName = 'CALL_' + this.room
    // takes the room stored in the database, and maps it to the in memory room
    const updatedRoom = await this.mapPersistedToMemory(this.room)
    // sets up our roomStats with the appropriate amount of buckets
    this.roomStats = new RoomStats(this.maxGen, this.populationSize)
    this.updateAdmins()
    // checks to see if the job is running already and if not, starts the job
      if (!this.isJobRunning()) {
        this.startJob()
        Object.keys(this.nodes).forEach((id, i) => {
          socket.to(id).emit(callName, { task: this.tasks.shift() })
        })
      }
      else {
        console.log(chalk.red(`${this.room} already running!`))
      }
  }

  terminateOrDistribute(finishedTask, socket, io) {
    // decides whether to hand off the final generation to the final selection function OR distributes the next task on queue to the worker node

    // Avoid pushing history multiple times by checking jobRunning
    // if termination condition is met and the alg is still running..
    const allDone = this.shouldTerminate(finishedTask.fitnesses)
    if (allDone) {
      // terminate
      let results = {}
      if (Math.max(...finishedTask.fitnesses) < this.fitnessGoal) {
        results = this.finalSelection()
      } else {
        const fittestIndex = finishedTask.fitnesses.indexOf(Math.max(...finishedTask.fitnesses))
        results = {
          winningChromosome: finishedTask.population[fittestIndex],
          fitness: finishedTask.fitnesses[fittestIndex]
        }
      }
      this.algorithmDone(results.winningChromosome, results.fitness, socket)
      this.emptyTaskQueue()
    } else {
      // Edge Case, if a user leaves the room while a task is finished by that user,
      // without checking if that user is still in the `nodes` array, we could hit a
      // Reference Error.
      if (this.totalTasks() > 0 && this.nodes[socket.id]) this.distributeWork(socket)
      this.createTask(finishedTask)
    }
    this.updateAdmins()
  }

  algorithmDone(winningChromosome, fitness, socket) {
    const endTime = Date.now()
    function convertMS(ms) {
      let d, h, m, s
      s = Math.floor(ms / 1000)
      m = Math.floor(s / 60)
      s = s % 60
      h = Math.floor(m / 60)
      m = m % 60
      d = Math.floor(h / 24)
      h = h % 24
      return `days: ${d}, hours: ${h}, minutes: ${m}, seconds: ${s}`
    };
    console.log(chalk.green(`DURATION OF ${this.room}: `, convertMS(endTime - this.start)))
    console.log(chalk.magenta(`BEST CHROMOSOME: ${winningChromosome}`))
    console.log(chalk.magenta(`BEST FITNESS: ${fitness}`))
    this.updateAdmins()
    this.lastResult = winningChromosome.reduce((result, gene) => {
      return result + gene
    }, '')
    this.isDone = true
    this.stopJob(socket)
  }
  updateAdmins() {
    forEach(this.admins, admin => admin.emit('UPDATE_' + this.room, {
      nodes: this.nodes,
      start: this.start,
      bucket: this.bucket,
      jobRunning: this.jobRunning,
      fitness: this.fitness,
      chromosomesReturned: this.chromosomesReturned,
      totalFitness: this.totalFitness,
      stats: this.roomStats ? this.roomStats.getStats() : []
    }))
  }

  doneCallback(finishedTask, socket, io) {
    if (this.isJobRunning) {
      this.updateRoomStats(finishedTask)
      this.totalTasksCompleted++
      console.log(this.totalTasksCompleted);
      // If a task comes back after a server restart, ignore it.
      if (this.roomStats) this.roomStats.updateGenerationData(finishedTask)
      // update the bucket
      this.updateBucket(finishedTask)
      // checks if termination conditions are met and acts accordingly
      this.terminateOrDistribute(finishedTask, socket, io)
      this.updateAdmins()
      console.log(chalk.green('DONE: '), socket.id, finishedTask.room)
    }
  }
}

module.exports = { RoomManager }
