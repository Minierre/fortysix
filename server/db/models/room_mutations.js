const Sequelize = require('sequelize')
const db = require('../db')

const RoomMutations = db.define('room_mutations', {
  chanceOfMutation: {
    type: Sequelize.FLOAT,
    validate: {
      min: 0,
      max: 1
    }
  }
})

module.exports = RoomMutations
