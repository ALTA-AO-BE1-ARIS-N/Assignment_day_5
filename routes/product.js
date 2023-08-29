const express = require('express');
const router = express.Router();

const products = [
  { id: 1, name: 'Product A', stock: 10 },
  { id: 2, name: 'Product B', stock: 20 }
];

// Get all products
router.get('/products', (req, res) => {
  res.json(products);
});

// Create a new product
router.post('/products', (req, res) => {
  const { name, stock } = req.body;
  if (!name || !stock) return res.status(400).json({ message: 'Name and stock are required' });

  const newProduct = { id: products.length + 1, name, stock };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Update product stock
router.put('/products/:product_id', (req, res) => {
  const productId = parseInt(req.params.product_id);
  const product = products.find(product => product.id === productId);

  if (!product) return res.status(404).json({ message: 'Product not found' });

  const newStock = req.body.stock;
  if (typeof newStock !== 'number') return res.status(400).json({ message: 'Invalid stock value' });

  product.stock = newStock;
  res.json({ message: `Stock for ${product.name} updated successfully` });
});

// Delete product
router.delete('/products/:product_id', (req, res) => {
  const productId = parseInt(req.params.product_id);
  const productIndex = products.findIndex(product => product.id === productId);

  if (productIndex === -1) return res.status(404).json({ message: 'Product not found' });

  products.splice(productIndex, 1);
  res.json({ message: 'Product deleted successfully' });
});

module.exports = router;
