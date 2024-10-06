const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const InventoryModel = require('./models/inventory')
const CartModel = require('./models/cart')

const app = express()
app.use(cors())
app.use(express.json())

const MONGO_URL = "mongodb+srv://ishop:ishop123@projects.smsnj61.mongodb.net/iShop";

mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("Database connected");
  })
  .catch((e) => {
    console.log(e);
  });

app.get('/inventorydetails', async (req, res) => {
  InventoryModel.find({})
    .then(inventory => res.json(inventory))
    .catch(err => res.status(500).json(err));
});


app.get('/cartdetails', async (req, res) => {
  try {
    const cartItems = await CartModel.find().populate('pname');
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cart details', error: err });
  }
});

app.post("/CreateInventory", (req, res) => {
  const { productId, name, category, quantity, price, imageUrl, description } = req.body;
  InventoryModel.create({ productId, name, category, quantity, price, imageUrl, description })
    .then(inventory => res.json(inventory))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while adding new inventory' })
    });
});

app.post("/addCart", (req, res) => {
  const { pId, pname, cqty, price, total } = req.body;
  CartModel.create({ pId, pname, cqty , price, total})
    .then(cart => res.json(cart))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while adding new items' })
    });
});

app.get('/getInventory/:id', async (req, res) => {
  const id  = req.params.id;

  try {
    const item = await InventoryModel.findById(id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching item details', error });
  }
});


app.get('/getCart/:id', (req, res) => {
  const id = req.params.id;
  CartModel.findById({ _id: id })
    .then(cart => res.json(cart))
    .catch(err => res.json(err))
})

app.put("/updateInventory/:id", (req, res) => {
  const id = req.params.id;
  InventoryModel.findByIdAndUpdate({ _id: id }, {
    productId: req.body.productId,
    name: req.body.name,
    category: req.body.category,
    quantity: req.body.quantity,
    price: req.body.price,
    imageUrl: req.body.imageUrl,
    description: req.body.description,
  }, { new: true })

    .then(inventory => res.json(inventory))
    .catch(err => res.json(err))
});

app.put("/updateCart/:id", (req, res) => {
  const id = req.params.id;
  CartModel.findByIdAndUpdate({ _id: id }, {
    pId: req.body.pId,
    cqty: req.body.cqty,
  }, { new: true })

    .then(cart => res.json(cart))
    .catch(err => res.json(err))
});

/*app.delete('/deleteCart/:id', async (req, res) => {
  try {
    const deleted = await CartModel.findByIdAndDelete(req.params.id);
    
    if (deleted) {
      res.status(200).json({ message: "Deleted successfully" });
    } else {
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});*/

app.delete('/deleteCart/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
  }

  console.log('Deleting item with ID:', id);
  try {
      const deleted = await CartModel.findByIdAndDelete(id);

      if (deleted) {
          return res.status(200).json({ message: "Deleted successfully" });
      } else {
          return res.status(404).json({ message: "Item not found" });
      }
  } catch (error) {
      console.error("Error deleting cart item:", error);
      return res.status(500).json({ message: "Internal server error" });
  }
});

app.delete('/deleteInventory/:id', async(req,res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
  }

  console.log('Deleting item with ID:', id);
  try{
    const deleted = await InventoryModel.findByIdAndDelete(req.params.id);

    if (deleted) {
      res.status(200).json({ message: "Deleted successfully" });
    } else { 
      res.status(404).json({ message: "Item not found" });
    }
  } catch (error) {   
    console.error("Error deleting Inventory:", error);    
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(3000, () => {
  console.log('Node js has started...');
})