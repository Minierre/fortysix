const router = require('express').Router()
const { Room } = require('../db/models')
const uuid = require('uuid/v1')

module.exports = router

router.post('/', (req, res, next) => {
  Room.create(req.body)
    .then(newRoom => res.json(newRoom))
    .catch(next)
})

router.get('/', (req, res, next) => {
  Room.findAll()
    .then(rooms => res.json(rooms))
    .catch(next)
})
