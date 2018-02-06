const Sequelize = require('sequelize')
const db = require('../db')

const History = db.define('history', {
  nodes: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  room: {
    type: Sequelize.STRING
  },
  startTime: {
    type: Sequelize.DATE,
    allowNull: false
  },
  endTime: {
    type: Sequelize.DATE,
    allowNull: false
  },
  result: {
    type: Sequelize.TEXT
  },
  maxGen: {
    type: Sequelize.INTEGER
  },
  populationSize: {
    type: Sequelize.INTEGER
  },
  chromosomeLength: {
    type: Sequelize.INTEGER
  },
  fitnessGoal: {
    type: Sequelize.INTEGER
  },
  elitism: {
    type: Sequelize.INTEGER
  },
  reproductiveCoefficient: {
    type: Sequelize.INTEGER
  },
  fitnessFunc: {
    type: Sequelize.TEXT
  },
  mutations: {
    type: Sequelize.TEXT
  },
  selection: {
    type: Sequelize.TEXT
  },
  genePool: {
    type: Sequelize.TEXT
  },
  admins: {
    type: Sequelize.TEXT
  },
  totalFitness: {
    type: Sequelize.BIGINT
  },
  roomStats: {
    type: Sequelize.ARRAY(Sequelize.TEXT)
  }
})

module.exports = History
