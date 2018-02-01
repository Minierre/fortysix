const Sequelize = require('sequelize')
const db = require('../db')

const Parameters = db.define('parameters', {
  chromosomeLength: {
    type: Sequelize.INTEGER,
    defaultValue: 50
  },
  generations: {
    type: Sequelize.INTEGER,
    defaultValue: 2
  },
  elitism: {
    type: Sequelize.FLOAT,
    defaultValue: 0.23
  },
  populationSize: {
    type: Sequelize.INTEGER,
    defaultValue: 50
  },
  fitnessGoal: {
    type: Sequelize.INTEGER,
    defaultValue: 23
  }
})

module.exports = Parameters
