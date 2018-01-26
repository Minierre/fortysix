const router = require('express').Router()
const { Room } = require('../db/models')
const uuid = require('uuid/v1')

module.exports = router

router.post('/', (req, res, next) => {
  Room.create(req.body)
    .then(newRoom => res.json(newRoom))
    .catch(next);
});

router.get('/:roomHash', (req, res, next) => {
  console.log(req.params.roomHash);
  Room.findOne({where:{roomHash: req.params.roomHash}})
  .then(room => res.json(room))
  .catch(next)
})
