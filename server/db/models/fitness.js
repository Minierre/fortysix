const Sequelize = require('sequelize')
const db = require('../db')

const Fitness = db.define('fitness', {
  function: {
    type: Sequelize.TEXT
  },
  name: {
    type: Sequelize.STRING
  }
})

module.exports = Fitness
