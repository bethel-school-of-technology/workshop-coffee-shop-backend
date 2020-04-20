const express = require('express')
const router = express.Router()
const Product = require('../models/product')
const User = require('../models/user')
const authService = require("../services/auth");

async function getProduct(req, res, next){
  let product = null

  try {
    product = await Product.findById(req.params.id)
    if(product == null){
      return res.status(400).json({msg: "Can't find product"})
    }
  } catch (err){
    return res.status(400).json({ msg: err.message })
  }

  res.product = product
  next()
}


// GET ALL PRODUCTS
router.get('/', async (req, res)=> {
  try{
    const products = await Product.find()
    res.json(products)
  } catch (err) {
    res.status(400).json({msg: err})
  }
})

// GET SINGLE PRODUCT
router.get('/:id', getProduct, (req, res) =>{
  res.json(res.product)
})

// CREATE A PRODUCT
router.post('/add', async (req, res) =>{

  let product = new Product({
    name: (req.body.name) ? req.body.name : null,
    description: (req.body.description) ? req.body.description : null,
    descriptionTwo: (req.body.descriptionTwo) ? req.body.descriptionTwo : null,
    size: (req.body.size) ? req.body.size : null,
    image: (req.body.image) ? req.body.image : null,
    price: (req.body.price) ? req.body.price : null,
    category: (req.body.category) ? req.body.category : null,
    popular: (req.body.popular) ? req.body.popular : false
  })

  try{
    const newProduct = await product.save()
    res.status(200).json(newProduct)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }

})

// UPDATE A PRODUCT
router.put('/:id', getProduct, async (req, res) => {
  if(req.body.name != null){
    res.product.name = req.body.name
  }

  if(req.body.description != null){
    res.product.description = req.body.description
  }

  if(req.body.descriptionTwo != null){
    res.product.descriptionTwo = req.body.descriptionTwo
  }

  if(req.body.size != null){
    res.product.size = req.body.size
  }

  if(req.body.image != null){
    res.product.image = req.body.image
  }

  if(req.body.price != null){
    res.product.price = req.body.price
  }

  if(req.body.category != null){
    res.product.category = req.body.category
  }

  if(req.body.popular != null){
    res.product.popular = req.body.popular
  }

  try {
    const updatedProduct = await res.product.save()
    res.json(updatedProduct)
  } catch {
    res.status(400).json({ message: err.message })
  }
})

// DELETE A PRODUCT
router.delete('/:id', getProduct, async (req, res) => {
  try {
    await res.product.remove()
    res.json({ message: 'Deleted This Product' })
  } catch(err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router