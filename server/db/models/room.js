const Sequelize = require('sequelize')
const db = require('../db')

const Room = db.define('room', {
  roomHash: {
    type: Sequelize.STRING,
    unique: true,
  },
  roomName: {
    type: Sequelize.STRING,
    unique: true,
  },
})

module.exports = Room
