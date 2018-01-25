const Sequelize = require('sequelize')
const db = require('../db')

const Selections = db.define('selections', {
  function: {
    type: Sequelize.TEXT
  },
  name: {
    type: Sequelize.STRING
  }
})

module.exports = Selections
