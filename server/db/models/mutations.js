const Sequelize = require('sequelize')
const db = require('../db')

const Mutations = db.define('mutations', {
  function: {
    type: Sequelize.TEXT
  },
  name: {
    type: Sequelize.STRING
  }
})

module.exports = Mutations
