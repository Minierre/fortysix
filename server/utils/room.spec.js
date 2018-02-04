const { expect } = require('chai')
const { describe, it, beforeEach } = require('mocha')
const app = require('../index.js')
const db = require('../db')
const Room = db.model('room')
const { RoomManager } = require('./room')

describe('RoomManager', () => {
  let roomManager
  let roomPersisted

  beforeEach(() => {
    return Room.findOne().then((roomObj) => {
      roomPersisted = roomObj
      roomManager = new RoomManager(roomObj.roomHash)
    })
  })

  it('initializes with initial state', () => {
    expect(roomManager.getState()).to.deep.equal({
      room: roomPersisted.roomHash,
      nodes: {},
      tasks: [],
      jobRunning: false,
      start: null,
      lastResult: null,
      bucket: {},
      maxGen: null,
      populationSize: null,
      chromosomeLength: null,
      fitnessGoal: 0,
      elitism: null,
      reproductiveCoefficient: 1,
      fitness: null,
      mutations: null,
      selection: null,
      genePool: [],
      admins: {},
      chromosomesReturned: 0,
      totalFitness: 0,
      roomStats: null
    })
  })

  it('should terminate it is expected to', () => {
    roomManager.maxGen = 5
    roomManager.populationSize = 100
    roomManager.fitnessGoal = 90
    roomManager.bucket[roomManager.maxGen] = {
      population: new Array(100)
    }
    roomManager.jobRunning = true

    expect(roomManager.shouldTerminate([101])).to.equal(true)
  })

  it('should terminate when fitnessGoal reaches maximum', () => {
    roomManager.fitnessGoal = 90
    roomManager.jobRunning = true
    expect(roomManager.shouldTerminate([101])).to.equal(true)
  })
})
