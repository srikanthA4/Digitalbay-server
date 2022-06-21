const router = require('express').Router();
const Product = require('../models/productModel');
const { verify } = require('./verifyToken');

// CREATE PRODUCT
router.post('/create', verify, async (req, res) => {
  const newProduct = new Product(req.body);
  if(req.user.isAdmin) {
    try {
      const savedProduct = await newProduct.save();
      return res.status(200).json({ message: 'Product created successfully', payload: savedProduct });
    }
    catch (error) {
      console.log(error)
      return res.status(500).json(error)
    }
  } else {
    res.status(403).json("You do not have permission!");
  }
});

// UPDATE PRODUCT
router.put('/update/:id', verify, async (req, res) => {
  if(req.user.isAdmin){
    try {
      await Product.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
      const allProducts = await Product.find();
      return res.status(200).json(allProducts.reverse());
    } catch (error) {
      return res.status(500).json(error)
    }
  } else {
    res.status(403).json("You do not have permission!");
  }
});

// DELETE PRODUCT
router.delete('/delete/:id', verify, async (req, res) => {
  if(req.user.isAdmin){
    try {
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Product deleted successfully', payload: deletedProduct });
    } catch (error) {
      res.status(500).json(error);
    }
  }
});

// GET PRODUCT BY ID
router.get('/find/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    return res.status(200).json({ message: 'Product Info', payload: product });
  } catch (error) {
    return res.status(500).json(error)
  }
});

// GET ALL PRODUCTS
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json(products.reverse());
  } catch (error) {
    return res.status(500).json(error)
  }
});

module.exports = router;