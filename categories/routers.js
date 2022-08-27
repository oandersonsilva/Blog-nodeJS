const express = require('express')
const router = express.Router()
const app = express()
const Category = require('./Category')
const slugify = require('slugify')
const bodyParser = require('body-parser')
/* 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json()) */

router.get('/admin/categories/new', (req, res) => {
  res.render('admin/categories/new')
})

router.post('/categories/save?title', (req, res) => {
  var title = req.body.title // não está achando o obejto title
  if (title != undefined) {
    Category.create({
      title: title,
      slug: slugify(title)
    })
  } else {
    res.redirect('/admin/categories/new')
  }
})

router.get('/admin/categories', (req, res) => {
  res.render('admin/categories/index')
})

module.exports = router
