const express = require('express')
const User = require('./Users')
const router = express.Router()
const bcrypt = require('bcryptjs')
const adminAuth = require('../middlewares/adminAuth')

router.get('/admin/users', (req, res) => {
  User.findAll().then(users => {
    res.render('admin/users/index', {
      users: users
    })
  })
})

router.get('/admin/users/create', adminAuth, (req, res) => {
  res.render('admin/users/create')
})

router.post('/createUser', (req, res) => {
  var username = req.body.username
  var password = req.body.password

  User.findOne({ where: { username: username } })
    .then(repetido => {
      if (repetido != undefined) {
        res.redirect('/admin/users/create')
      } else {
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
      }
    })
    .catch(err => {
      console.log(err)
    })
})

router.get('/login', (req, res) => {
  res.render('admin/users/login')
})

router.post('/authenticate', (req, res) => {
  var username = req.body.username
  var password = req.body.password

  User.findOne({ where: { username: username } })
    .then(user => {
      if (user != undefined) {
        var correct = bcrypt.compareSync(password, user.password)
        if (correct) {
          req.session.user = {
            id: user.id,
            email: user.email
          }

          res.json({
            user: req.session.user
          })
        } else {
          res.redirect('/login')
        }
      } else {
        res.redirect('/login')
      }
    })
    .catch(err => {
      console.log(err)
    })
})

router.get('/logout', (req, res) => {
  req.session.user = undefined
  res.redirect('/')
})

module.exports = router
