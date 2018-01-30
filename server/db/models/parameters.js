const Sequelize = require('sequelize')
const db = require('../db')

const Parameters = db.define('parameters', {
  chromosomeLength: Sequelize.INTEGER,
  generations: Sequelize.INTEGER,
  elitism: Sequelize.FLOAT,
  populationSize: Sequelize.INTEGER,
  fitnessGoal: Sequelize.INTEGER
})

module.exports = Parameters
