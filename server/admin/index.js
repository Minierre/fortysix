const { Room } = require('../db/models')
const router = require('express').Router()

module.exports = router

router.get('/:roomHash', (req, res, next) => {
  // we make sure that the user who created the room is the only one who can get into the admin page (or an admin user)
  Room.findOne({
    where: { roomHash: req.params.roomHash }, attributes: ['userId', 'roomHash']
  }).then((room) => {
    if (room.userId !== req.user.id && !req.user.isAdmin) {
      res.status(401).redirect(`/contributor/${room.roomHash}`)
    } else {
      next()
    }
  }).catch(err => next(err))
})
