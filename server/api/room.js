const router = require('express').Router()
const Sandbox = require('sandbox')
const {
  Room,
  Parameters,
  Mutations,
  Selections,
  RoomMutations
} = require('../db/models')

module.exports = router

const sandbox = new Sandbox()

router.get('/all', (req, res, next) => {
  Room.findAll()
    .then(rooms => res.json(rooms))
    .catch(next)
})

router.get('/:roomHash', (req, res, next) => {
  Room.findOne({
    where: { roomHash: req.params.roomHash || null },
    include: [
      {
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
      }
    ]
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

  if (req.body.fitnessFunc) {
   /*
      It is considered malicious to create a Room with a fitness function
      We want to avoid implementing sandbox here so we forbid the
      The behavior completely.
   */
    const err = new Error('You tried to create a Room with a fitness function.')
    err.status = 403
    next(err)
  } else {
    Room.create(req.body)
      .then(newRoom => res.json(newRoom))
      .catch(next)
  }
})

router.put('/:roomHash', (req, res, next) => {
    const {
    parameters,
    mutations,
    selection,
    fitnessFunc
  } = req.body

  sandbox.run(
    `let t = eval(${req.body.fitnessFunc});
    (() => t('1010'))()`,
    (output) => {
      const isValid = !isNaN(Number(output.result))
      if (isValid) {
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
      } else {
        res.status(403).send(output.result)
      }
    }
  )
})
