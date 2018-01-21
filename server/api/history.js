const router = require('express').Router()
const { History } = require('../db/models')

module.exports = router

router.get('/:room', (req, res, next) => {
  History.findAll({
    where: { room: req.params.room }
  })
    .then(users => res.json(users))
    .catch(next)
})
