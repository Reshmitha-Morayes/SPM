const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    pId: String,
    pname: String,
    cqty: { type: Number, default: 1 },
    price: Number,
    total: Number
})

const CartModel = mongoose.model("carts", cartSchema)
module.exports = CartModel