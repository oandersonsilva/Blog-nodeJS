const express = require('express')
const User = require('./Users')
const router = express.Router()
const bcrypt = require('bcryptjs')

router.get('/admin/users', (req, res) => {
  res.send('lista Usuários')
})

router.get('/admin/users/create', (req, res) => {
  res.render('admin/users/create')
})

router.post('/createUser', (req, res) => {
  var username = req.body.username
  var password = req.body.password

  var salt = bcrypt.genSaltSync(10)
  var hash = bcrypt.hashSync(password, salt)

  User.create({
    username: username,
    password: hash
  })
    .then(() => {
      res.redirect('/')
    })
    .catch(err => {
      res.redirect('/')
    })
})

module.exports = router
