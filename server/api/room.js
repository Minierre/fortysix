const router = require('express').Router()
const {
  Room, Parameters, Mutations, Selections
} = require('../db/models')
const Sandbox = require('sandbox')

const s = new Sandbox()

module.exports = router

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
      return { ...rest, mutations: newMutations }
    })
    .then(room => res.json(room))
    .catch(next)
})

router.post('/', (req, res, next) => {
  const f = req.body.fitnessFunc
  if (!f) {
    Room.create(req.body)
    .then(newRoom => res.json(newRoom))
    .catch(next)
  } else {
    s.run(
      `(() => { let fitFunc = eval("(" + ${f} + ")")
      return fitFunc()})()`,
      (output) => {
        const isNum = Number(output.result)
        console.log(isNum)
        if (!isNaN(isNum)) {
          Room.create(req.body)
          .then(newRoom => res.json(newRoom))
          .catch(next)
        } else {
          res.status(400).send(output.result)
        }
      }
    )
  }
})

router.put('/:roomHash', (req, res, next) => {
  const f = req.body.fitnessFunc
  console.log(f)
  console.log(req.body)
  s.run(
    `(() => { let fitFunc = eval("(" + ${f} + ")")
    return fitFunc()})()`,
    (output) => {
      const isNum = Number(output.result)
      console.log(isNum)
      if (!isNaN(isNum)) {
        Room.update(
          { fitnessFunc: req.body.fitnessFunc },
          {
            where: { roomHash: req.params.roomHash },
            returning: true, // needed for affectedRows to be populated
            plain: true // makes sure that the returned instances are just plain objects
          }
        )
          .spread((numberOfAffectedRows, affectedRows) => res.status(201).send(affectedRows))
          .catch(next)
      } else {
        res.status(400).send(output.result)
      }
    }
  )
})
