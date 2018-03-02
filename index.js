//docker run --rm -p 5432:5432 --name products-db -e POSTGRES_PASSWORD=secret postgres

const express = require('express')
const app = express()

var Sequelize = require('sequelize')
var sequelize = new Sequelize('postgres://postgres:secret@localhost:5432/postgres')

app.listen(4001, () => console.log('Express API listening on port 4001'))

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE')
  next()
})

const Product = sequelize.define('product', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  price: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false
  },
  image: Sequelize.STRING
}, {
  tableName: 'products',
  timestamps: false
})

app.get('/products', (req, res) => {
  Product.findAll({
  attributes: ['id', 'name', 'price']
})
  .then(result => {
    res.json(result)
  })
  .catch(err => {
    console.error(err)
    res.status(500)
    res.json({ message: 'Oops! There was an error getting the products. Please try again' })
  })
})

app.get('/products/:id', (req, res) => {
  Product.findById(req.params.id)
  .then(result => {
    if (result) {
      res.json(result)
    } else {
        res.status(404)
        res.json({ message: 'Product not found!' })
      }
  })
  .catch(err => {
    console.error(err)
    res.status(500)
    res.json({ message: 'Oops! There was an error getting the products. Please try again' })
  })
})
