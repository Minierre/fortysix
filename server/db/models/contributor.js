const Sequelize = require('sequelize')
const db = require('../db')

const Contributor = db.define('contributor', {
  tasksCompleted: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  }
})

module.exports = Contributor
