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

app.get('/', (req, res) => {
  res.render('index')
})

app.use('/', categoriesRouters)
app.use('/articles', articlesRouters)

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

app.post('/saveTester', (req, res) => {
  console.log(req.body)
  res.send('cadastrou')
})

app.listen(port, () => {
  console.log('sistema rodando na porta ' + port)
})
