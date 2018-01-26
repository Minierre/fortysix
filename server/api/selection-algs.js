const router = require('express').Router()
const { Selections } = require('../db/models')

module.exports = router

router.get('/', (req, res, next) => {
  Selections.findAll({ attributes: ['id', 'name'] })
    .then(funcs => res.json(funcs))
    .catch(next);
});
