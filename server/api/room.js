const router = require('express').Router()
const { Room } = require('../db/models')

module.exports = router

router.post('/', (req, res, next) => {
  Room.create(req.body)
    .then(newRoom => res.json(newRoom))
    .catch(next);
});
