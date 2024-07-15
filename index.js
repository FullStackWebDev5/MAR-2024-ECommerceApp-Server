const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
var cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

const Product = mongoose.model('Product', {
  name: String,
  imageURL: String,
  mrp: Number,
  actualPrice: Number,
  rating: Number
})

app.get('/', (req, res) => {
  res.json({
    status: 'Server is up :)',
    now: new Date()
  })
})

app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json({
      status: 'SUCCESS',
      data: products
    })
  } catch (error) {
    res.status(500).json({
      status: 'FAILED',
      message: 'Something went wrong'
    })
  }
})

app.post('/products', async (req, res) => {
  try {
    const { name, imageURL, mrp, actualPrice, rating } = req.body
    await Product.create({ name, imageURL, mrp, actualPrice, rating });
    res.json({
      status: 'SUCCESS',
      message: 'Product created successfully'
    })
  } catch (error) {
    res.status(500).json({
      status: 'FAILED',
      message: 'Something went wrong'
    })
  }
})

app.patch('/products/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { name, imageURL, mrp, actualPrice, rating } = req.body
    await Product.findByIdAndUpdate(id, { name, imageURL, mrp, actualPrice, rating });
    res.json({
      status: 'SUCCESS',
      message: 'Product updated successfully'
    })
  } catch (error) {
    res.status(500).json({
      status: 'FAILED',
      message: 'Something went wrong'
    })
  }
})

app.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params
    await Product.findByIdAndDelete(id);
    res.json({
      status: 'SUCCESS',
      message: 'Product deleted successfully'
    })
  } catch (error) {
    res.status(500).json({
      status: 'FAILED',
      message: 'Something went wrong'
    })
  }
})

app.listen(4000, () => {
  mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('Server is running :)'))
  .catch((error) => console.log(error))
})
