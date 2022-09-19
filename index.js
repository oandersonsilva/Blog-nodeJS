const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/connection')
const categoriesRouters = require('./categories/routers')
const articlesRouters = require('./articles/routers')
const userRouters = require('./users/routers')
const Article = require('./articles/Article')
const Category = require('./categories/Category')
const { default: slugify } = require('slugify')
const User = require('./users/Users')

const port = 3000

app.set('view engine', 'ejs')

app.use('/', categoriesRouters)
app.use('/', articlesRouters)
app.use('/', userRouters)

//Static archives

app.use(express.static('public'))

//Body parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Database connection

connection
  .authenticate()
  .then(() => {
    console.log('conexão com banco de dados estabelecida')
  })
  .catch(err => {
    console.log(err)
  })

app.get('/', (req, res) => {
  Article.findAll({ order: ['id'], limit: 3 }).then(list => {
    Category.findAll({}).then(listCategory => {
      res.render('index', { listArticle: list, listCategory: listCategory })
    })
  })
})

app.post('/saveTester', (req, res) => {
  console.log(req.body)
  res.send('cadastrou')
})

app.get('/category/:slug', (req, res) => {
  var slug = req.params.slug
  Category.findOne({
    where: {
      slug: slug
    },
    include: [{ model: Article }]
  })
    .then(category => {
      if (category != undefined) {
        Category.findAll().then(categories => {
          res.render('index', {
            listArticle: category.articles,
            listCategory: categories
          })
        })
      } else {
        res.redirect('/')
      }
    })
    .catch(err => {
      res.redirect('/')
    })
})

app.get('/:slug', (req, res) => {
  var slug = req.params.slug
  Article.findOne({
    where: {
      slug: slug
    }
  })
    .then(article => {
      if (article != undefined) {
        Category.findAll().then(listCategory => {
          res.render('article', {
            article: article,
            listCategory: listCategory
          })
        })
      } else {
        res.redirect('/')
      }
    })
    .catch(err => {
      res.redirect('/')
    })
})

app.get('/admin/articles/edit/:slug', (req, res) => {
  var slug = req.params.slug
  Article.findOne({
    where: {
      slug: slug
    }
  }).then(article => {
    Category.findAll().then(categories => {
      res.render('./admin/articles/edit', {
        article: article,
        categories: categories
      })
    })
  })
})

app.post('/editArticle', (req, res) => {
  var title = req.body.title
  var body = req.body.bodyArticle
  var id = req.body.idArticle
  var categoryId = req.body.categorias

  Article.update(
    {
      title: title,
      body: body,
      slug: slugify(title),
      categoryId: categoryId
    },
    { where: { id: id } }
  )
    .then(() => {
      res.redirect('admin/articles')
    })
    .catch(err => {
      console.log(err)
    })
})

app.listen(port, () => {
  console.log('sistema rodando na porta ' + port)
})
