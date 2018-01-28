const Sequelize = require('sequelize')
const db = require('../db')

const Room = db.define('room', {
  roomHash: {
    type: Sequelize.STRING,
    unique: true
  },
  fitnessFunc: {
    type: Sequelize.TEXT
  },
  roomName: {
    type: Sequelize.STRING,
    unique: true
  }
})

module.exports = Room
