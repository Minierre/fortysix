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

Room.getRoomWithAssociations = (roomHash = null, parameters, selections, mutations) => {
  return Room.findOne({
    where: { roomHash },
    include: [{
      model: parameters,
      through: {
        attributes: []
      }
    },
    {
      model: selections,
      attributes: ['name', 'function', 'id']
    },
    {
      model: mutations,
      through: {
        attributes: ['chanceOfMutation']
      }
    }]
  })
    .then((room) => {
      // Decycle and reshape mutations array because Sequelize isn't perfect
      const { mutations, ...rest } = JSON.parse(JSON.stringify(room))
      const newMutations = mutations.map((mutation) => {
        mutation.chanceOfMutation = mutation.room_mutations.chanceOfMutation
        delete mutation.room_mutations
        return mutation
      })
      return { ...rest, mutations: newMutations, parameters: room.parameters[0] }
    })
}

Room.hook('beforeCreate', (room) => {
  const hash = uuid()
  room.roomHash = hash
})

module.exports = Room
