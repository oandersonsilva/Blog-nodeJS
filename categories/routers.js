const express = require('express')
const router = express.Router()
const app = express()
const Category = require('./Category')
const slugify = require('slugify')
const bodyParser = require('body-parser')

/* app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json()) */

router.get('/admin/categories/new', (req, res) => {
  res.render('admin/categories/new')
})

router.post('/categories/save', (req, res) => {
  /* var titulo = req.body.title // não está achando o objeto title
  if (titulo != undefined) {
    Category.create({
      title: titulo,
      slug: slugify(titulo)
    }) */

  res.redirect('/admin/categories/new')
  /* } else { */
  //res.redirect('/admin/categories/new')
  //}
})

router.get('/admin/categories', (req, res) => {
  Category.findAll().then(categories => {
    res.render('admin/categories/index', { categories: categories })
  })
})

module.exports = router
