const Sequelize = require('sequelize')
const db = require('../db')

const User = db.define('user', {
  username: {
    type: Sequelize.STRING
  },
  spotifyId: {
    type: Sequelize.INTEGER
  },
  playlistId: {
    type: Sequelize.INTEGER
  }
})

User.belongsToMany(User, { as: 'follower', through: 'UserFollower' })

module.exports = User
