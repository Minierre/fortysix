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
  }
})

module.exports = History
