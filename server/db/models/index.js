const User = require('./user')
const History = require('./history')
const Room = require('./room')
const Mutations = require('./mutations')
const Selections = require('./selections')
const RoomMutations = require('./room_mutations')
const Parameters = require('./parameters')
const RoomParameters = require('./room_parameters')

Room.belongsToMany(Mutations, { through: 'room_mutations' })
Room.belongsToMany(Parameters, { through: 'room_parameters' })
Selections.hasOne(Room)
Room.belongsTo(Selections)
Room.belongsTo(User)
User.hasMany(Room)

module.exports = {
  User,
  History,
  Room,
  Mutations,
  RoomMutations,
  Parameters,
  RoomParameters,
  Selections,
}
