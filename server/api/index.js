const router = require('express').Router()
module.exports = router

router.use('/users', require('./users'))
router.use('/history', require('./history'))
router.use('/mutation-algs', require('./mutation-algs'))
router.use('/selection-algs', require('./selection-algs'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
