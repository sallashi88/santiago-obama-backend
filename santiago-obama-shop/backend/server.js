const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const Product = require('./product');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// POST /api/products - Add new product
app.post('/api/products', async (req, res) => {
  try {
    const { name, price, tags, image } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    const newProduct = new Product({
      name,
      price,
      tags: tags.split(',').map(tag => tag.trim()),
      image
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error('Upload failed:', err);
    res.status(500).json({ error: 'Failed to upload product' });
  }
});

// GET /api/products - Fetch all products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching products' });
  }
});

// GET /api/products/style/:keyword - Filter products by style/tag
app.get('/api/products/style/:keyword', async (req, res) => {
  try {
    const keyword = req.params.keyword.toLowerCase();
    const products = await Product.find({
      tags: { $in: [keyword] }
    });    
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


// DELETE /api/products/:id - Delete a product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

const Order = require('./order'); // ya importado arriba

app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json({ success: true });
  } catch (err) {
    console.error('Failed to save order:', err);
    res.status(500).json({ error: 'Failed to save order' });
  }
});


// GET - Ver todos los pedidos
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

const sendOrderEmail = require('./mailer'); // asegúrate de que esté bien la ruta

app.post('/api/orders', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    sendOrderEmail(req.body); // Enviar correo
    res.status(201).json({ success: true });
  } catch (err) {
    console.error('Failed to save order:', err);
    res.status(500).json({ error: 'Failed to save order' });
  }
});



// MongoDB connection and server startup
mongoose.connect('mongodb+srv://sallashiobama:QDEAbgISV9ydM8fr@cluster0.t7kceca.mongodb.net/santiago-shop?retryWrites=true&w=majority')
  .then(() => {
    console.log('MongoDB connected');
    app.listen(5000, () => console.log('Server is running on port 5000'));
  })
  .catch(err => console.error('MongoDB connection error:', err));
