const router = require('express').Router();
const User = require('../models/userModel');
const CryptoJS = require("crypto-js");
const { verify } = require('./verifyToken');

// UPDATE
router.put('/update/:id', verify, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY
      ).toString();
    }
    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body, }, { new: true });
      res.status(200).json({ message: 'User details updated successfully', payload: updatedUser });
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You can only update your account!");
  }
});

// DELETE
router.delete('/delete/:id', verify, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'User deleted successfully', payload: deletedUser });
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You can only delete your account!");
  }
});

// GET USERS
router.get('/find/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    .populate('transaction');
    const { password, email, ...info } = user._doc;
    res.status(200).json({ message: 'User Info', info });
  } catch (error) {
    res.status(500).json(error);
  }
});

// GET ALL USERS
router.get('/', verify, async (req, res) => {
  const query = req.query.new;
  if (req.user.isAdmin) {
    try {
      const users = query 
      ? await User.find().sort({_id:-1}).limit(10) 
      : await User.find()
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("You are not allowed to see all users!");
  }
});

module.exports = router;