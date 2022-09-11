const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/connection')
const categoriesRouters = require('./categories/routers')
const articlesRouters = require('./articles/routers')
const Article = require('./articles/Article')
const Category = require('./categories/Category')

const port = 3000

app.set('view engine', 'ejs')

app.use('/', categoriesRouters)
app.use('/', articlesRouters)

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
  Article.findAll({ order: ['id'] }).then(list => {
    Category.findAll().then(listCategory => {
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
        res.render('article', { article: article })
      } else {
        res.redirect('/')
      }
    })
    .catch(err => {
      res.redirect('/')
    })
})

app.listen(port, () => {
  console.log('sistema rodando na porta ' + port)
})
