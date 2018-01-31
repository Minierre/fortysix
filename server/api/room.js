const router = require('express').Router()
const {
  Room,
  Parameters,
  Mutations,
  Selections,
  RoomMutations
} = require('../db/models')

module.exports = router

router.get('/all', (req, res, next) => {
  Room.findAll()
    .then(rooms => res.json(rooms))
    .catch(next)
})

router.get('/:roomHash', (req, res, next) => {
  Room.findOne({
    where: { roomHash: req.params.roomHash || null },
    include: [{
      model: Parameters,
      through: {
        attributes: []
      }
    },
    {
      model: Selections,
      attributes: ['name', 'function', 'id']
    },
    {
      model: Mutations,
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
    .then(room => res.json(room))
    .catch(next)
})

router.post('/', (req, res, next) => {
  // return Room.create({ fitnessFunc })
  //   .then(async (room) => {
  //     await Parameters.create({}, {
  //       where: { id: parameters.id }
  //     })

  //     await mutations.map(async (mutation) => {
  //       await RoomMutations
  //         .update(
  //         { chanceOfMutation: mutation.chanceOfMutation },
  //         { where: { mutationId: mutation.id } }
  //         )
  //     })

  //     await Selections.update(selection, {
  //       where: { id: selection.id }
  //     })
  //   })
  Room.create(req.body)
    .then(newRoom => res.json(newRoom))
    .catch(next)
})

router.put('/:roomHash', (req, res, next) => {

  const {
    parameters,
    mutations,
    selection,
    fitnessFunc
  } = req.body

  return Room.update(
    { fitnessFunc },
    { where: { roomHash: req.params.roomHash } }
  )
    .spread(async () => {
      await Parameters.update(parameters, {
        where: { id: parameters.id }
      })

      await mutations.map(async (mutation) => {
        await RoomMutations
          .update(
            { chanceOfMutation: mutation.chanceOfMutation },
            { where: { mutationId: mutation.id } }
          )
      })

      await Selections.update(selection, {
        where: { id: selection.id }
      })

    }).then(() => {
      return Room.findOne({
        where: { roomHash: req.params.roomHash || null },
        include: [{
          model: Parameters,
          through: {
            attributes: []
          }
        },
        {
          model: Selections,
          attributes: ['name', 'function', 'id']
        },
        {
          model: Mutations,
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
        .then(room => res.json(room))
        .catch(next)
    })
    .catch(next)
})
