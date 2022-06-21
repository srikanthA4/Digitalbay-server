const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  image: { type: String, required: true },
	title: { type: String, required: true, unique: true },
	description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
}, { timestamps: true })

module.exports = mongoose.model("product", ProductSchema);