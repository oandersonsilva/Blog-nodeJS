const sequelize = require('sequelize')
const connection = require('../database/connection')

const User = connection.define('users', {
  username: {
    type: sequelize.STRING,
    allowNull: false
  },
  password: {
    type: sequelize.STRING,
    allowNull: false
  }
})

User.sync({ force: true })

module.exports = User