const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.render('admin/categories/new')
})

router.get('/home', (req, res) => {
  res.send('home')
})

module.exports = router
