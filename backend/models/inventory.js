const mongoose = require('mongoose')

const inventorySchema = new mongoose.Schema({
  productId: String,
  name: String,
  price: Number,
  quantity: Number,
  description: String,
  category: String,
  imageUrl: String
})

const InventoryModel = mongoose.model("inventories", inventorySchema);
module.exports = InventoryModel
