const router = require('express').Router();
const Transaction = require('../models/transactionModel');
const User = require('../models/userModel');
const { verify } = require('./verifyToken');
//install UUID

// CREATE TRANSACTION
router.post('/checkout', verify, async (req, res) => {
  const { user, total, cart, completed } = req.body;

  if(req.user) {
    try {
      const foundUser = await User.findById(user);
      const newTransaction = new Transaction({
        user: foundUser._id,
        cart: cart,
        total: total,
        completed: completed
      })
      const savedTransaction = await newTransaction.save();

      foundUser.transactionHistory.push(savedTransaction.id);

      await foundUser.save();

      return res.status(200).json({ message: 'Transaction created successfully', payload: savedTransaction });
    }
    catch (error) {
      console.log(error)
      return res.status(500).json(error)
    }
  } else {
    res.status(403).json("You do not have permission!");
  }
});

// GET ALL TRANSACTIONS
router.get('/', verify, async (req, res) => {
  if(req.user.isAdmin){
    try {
      const transactions = await Transaction.find();
      return res.status(200).json(transactions.reverse());
    } catch (error) {
      res.status(500).json(error)
    }
  } else {
    res.status(403).json("You do not have permission!")
  }
});

// DELETE TRANSACTION
router.delete('/delete/:id', verify, async (req, res) => {
  if(req.user.isAdmin){
    try {
      const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'Transaction deleted successfully', payload: deletedTransaction });
    } catch (error) {
      res.status(500).json(error);
    }
  }
});

module.exports = router;