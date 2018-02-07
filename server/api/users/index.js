const router = require('express').Router()
const { User, Room } = require('../../db/models')

module.exports = router

router.get('/:userId/rooms', (req, res, next) => {
  Room.findAll({
    where: { userId: req.params.userId },
  })
    .then(users => res.json(users))
    .catch(next)
})

router.get('/', (req, res, next) => {
  User.findAll({
    // explicitly select only the id and email fields - even though
    // users' passwords are encrypted, it won't help if we just
    // send everything to anyone who asks!
    attributes: ['id', 'email']
  })
    .then(users => res.json(users))
    .catch(next)
})
