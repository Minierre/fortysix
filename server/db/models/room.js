const Sequelize = require('sequelize')
const db = require('../db')
const uuid = require('uuid/v1')

const Room = db.define(
  'room',
  {
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
  }
)

Room.hook('beforeCreate', (room) => {
  const hash = uuid()
  room.roomHash = hash
})

module.exports = Room
