const {
  History,
  Room,
  Selections,
  Parameters,
  Mutations
} = require('../db/models')
const { generateTasks } = require('./tasks')
const chalk = require('chalk')

class InMemoryRoomManager {
  constructor(roomHash, socket) {
    this.room = roomHash
    this.nodes = {
      [socket.id]: {
        running: false,
        error: false
      }
    }
    this.tasks = []
    this.running = false
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
  }
  join(socket) {
    socket.join(this.room)
    this.nodes[socket.id] = { running: false, error: false }
  }
  disconnect(socket) {
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
    return this.running
  }
  startJob() {
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
  mapDatabaseToMemory(room) {
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
        this.running = true
        this.totalFitness = 0
        this.chromesomesReturned = 0
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
}

module.exports = { InMemoryRoomManager }
