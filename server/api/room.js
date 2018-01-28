const router = require('express').Router()
const { Room } = require('../db/models')

module.exports = router

router.get('/:roomHash', (req, res, next) => {
  Room.findOne({ where: { roomHash: req.params.roomHash } })
    .then(room => res.json(room))
    .catch(next)
})

router.post('/', (req, res, next) => {
  Room.create(req.body)
    .then(newRoom => res.json(newRoom))
    .catch(next)
})

router.put('/:roomHash', (req, res, next) => {
  Room.update(
    { fitnessFunc: req.body.fitnessFunc },
    {
      where: { roomHash: req.params.roomHash },
      returning: true, // needed for affectedRows to be populated
      plain: true // makes sure that the returned instances are just plain objects
    },
  )
    .spread((numberOfAffectedRows, affectedRows) => res.send(affectedRows))
    .catch(next)
})

