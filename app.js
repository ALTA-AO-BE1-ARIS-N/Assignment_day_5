const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
app.use(bodyParser.json());

const SECRET_KEY = 'your-secret-key';

// Sample data
const users = [
  { id: 1, username: 'admin', password: 'adminpass', role: 'admin' },
  { id: 2, username: 'user', password: 'userpass', role: 'user' }
];

const products = [
  { id: 1, name: 'Product A', stock: 10 },
  { id: 2, name: 'Product B', stock: 20 }
];

// Middleware for authentication
const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token is missing!' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token is invalid!' });
    req.user = user;
    next();
  });
};

// Authentication endpoint
app.post('/auth', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username && user.password === password);

  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ user_id: user.id }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

// Protected routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
app.use('/auth', authRoutes);
app.use('/api', authenticateToken, productRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});