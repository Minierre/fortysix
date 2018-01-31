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
      type: Sequelize.TEXT,
      defaultValue: "() => console.log('Hello, Darwin')"
    },
    roomName: {
      type: Sequelize.STRING,
      unique: true
    },
    selectionId: {
      type: Sequelize.INTEGER,
      // By default choose the first selection function
      defaultValue: 1
    }
  }
)

Room.hook('beforeCreate', (room) => {
  const hash = uuid()
  room.roomHash = hash
})

module.exports = Room
