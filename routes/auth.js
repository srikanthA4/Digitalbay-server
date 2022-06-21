const router = require('express').Router();
const User = require('../models/userModel');
const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');

// REGISTER
router.post('/register', async (req, res) => {
  const { username, firstName, lastName, email, password } = req.body;
  console.log(req.body)
  const newUser = new User({
    username: username,
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: CryptoJS.AES.encrypt(
      password,
      process.env.SECRET_KEY
      ).toString(),
    });
    
  try {
    const user = await newUser.save();
    res.status(201).json({ message: 'User created successfully', payload: user });
  } catch (error) {
    res.status(500).json(error);
  }
})

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).populate('transactionHistory');
    !user && res.status(401).json({ message: 'Email and Password do not match' });
    
    const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
    const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
    
    originalPassword !== req.body.password &&
    res.status(401).json({ message: 'Email and Password do not match' });
    
    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.SECRET_KEY,
      { expiresIn: "30d" }
    );
    
    const { password, ...info } = user._doc;
    res.status(200).json({ ...info, accessToken });
  } catch (error) {
    res.status(500).json(error);
  }
})

module.exports = router;