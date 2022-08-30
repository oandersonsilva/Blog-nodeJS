const express = require('express')
const router = express.Router()

const Category = require('./Category')
const slugify = require('slugify')
const bodyParser = require('body-parser')

router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())

router.get('/admin/categories/new', (req, res) => {
  res.render('admin/categories/new')
})

router.post('/categories/save', (req, res) => {
  var titulo = req.body.title
  if (titulo != undefined) {
    Category.create({
      title: titulo,
      slug: slugify(titulo)
    })
    console.log(req)
    res.redirect('/admin/categories/new')
  } else {
    res.redirect('/admin/categories/new')
  }
})

router.post('/categories/deleteCategory', (req, res) => {
  var id = req.body.id
  if (id != undefined) {
    if (id) {
      Category.destroy({
        where: {
          id: id
        }
      }).then(() => {
        res.redirect('/admin/categories')
      })
    } else {
      res.redirect('/admin/categories')
    }
  } else {
    res.redirect('/admin/categories')
  }
})

router.get('/admin/categories', (req, res) => {
  Category.findAll().then(categories => {
    res.render('admin/categories/index', { categories: categories })
  })
})

router.get('/admin/categories/edit/:id', (req, res) => {
  var id = req.params.id
  if (isNaN(id)) {
    res.redirect('/admin/categories')
  }
  Category.findByPk(id)
    .then(category => {
      if (category != undefined) {
        res.render('admin/categories/edit', { category: category })
      } else {
        res.redirect('/admin/categories')
      }
    })
    .catch(erro => {
      res.redirect('/admin/categories')
    })
})

router.post('/updateCategory', (req, res) => {
  var id = req.body.id
  var title = req.body.title
  Category.update(
    { title: title, slug: slugify(title) },
    {
      where: {
        id: id
      }
    }
  ).then(() => {
    res.redirect('/admin/categories')
  })
})

module.exports = router
