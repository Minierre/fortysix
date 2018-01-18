const Sequelize = require('sequelize')
const db = require('../db')


const UserText = db.define('UserText', {
  userText: {
    type: Sequelize.STRING
  }
})
