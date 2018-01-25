const router = require('express').Router()
const { Mutations } = require('../db/models')

module.exports = router

router.get('/', (req, res, next) => {
  Mutations.findAll({ attributes: ['id', 'name'] })
  .then(funcs => res.json(funcs))
  .catch(next);
});
