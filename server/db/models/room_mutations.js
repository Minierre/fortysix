const Sequelize = require('sequelize')
const db = require('../db')

const RoomMutations = db.define('room_mutations', {
  chanceOfMutation: {
    type: Sequelize.FLOAT,
    defaultValue: 0.2,
    validate: {
      min: 0,
      max: 1
    }
  }
})

module.exports = RoomMutations
