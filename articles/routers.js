const express = require('express')
const router = express.Router()
const Category = require('../categories/Category')
const Article = require('./Article')
const slugify = require('slugify')

router.get('/admin/articles', (req, res) => {
  Article.findAll({
    include: [{ model: Category }]
  }).then(list => {
    res.render('admin/articles/index', { listArticle: list })
  })
})

router.get('/admin/articles/new', (req, res) => {
  Category.findAll().then(lista => {
    res.render('admin/articles/new', { lista: lista })
  })
})

router.post('/article/save', (req, res) => {
  var title = req.body.title
  var categoryID = req.body.category
  var body = req.body.bodyArticle
  Article.create({
    title: title,
    slug: slugify(title),
    body: body,
    categoryId: categoryID
  })
    .then(() => {
      res.redirect('/admin/articles')
    })
    .catch(err => {
      console.log(err)
    })
})

//paginação
router.get('/article/page/:num', (req, res) => {
  var page = req.params.num
  var numOffset = 0
  var QtddArticles = 2

  if (isNaN(page) || page == 1) {
    numOffset = 0
  } else {
    numOffset = (parseInt(page)-1) * QtddArticles
  }
  Article.findAndCountAll({
    limit: QtddArticles,
    offset: numOffset,
    order: ['id']
  }).then(articles => {
    var next
    if (numOffset + QtddArticles >= articles.count) {
      next = false
    } else {
      next = true
    }
    var result = {
      page: parseInt(page),
      next: next,
      articles: articles
    }
    console.log(articles)

    Category.findAll().then(categories => {
      res.render('admin/articles/page', {
        result: result,
        categories: categories
      })
    })
  })
})

router.post('/articles/deleteArticle', (req, res) => {
  var id = req.body.id
  if (id != undefined) {
    if (id) {
      Article.destroy({
        where: {
          id: id
        }
      }).then(() => {
        res.redirect('/admin/articles')
      })
    } else {
      res.redirect('/admin/articles')
    }
  } else {
    res.redirect('/admin/articles')
  }
})

module.exports = router
