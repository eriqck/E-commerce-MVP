const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const authenticateToken = require('./middleware/authMiddleware');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = 3000;
const DB_FILE = 'db.json';

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Auth routes
app.use('/api', authRoutes);

// Helper functions
function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// ✅ GET all products (public)
app.get('/api/products', (req, res) => {
  const db = readDB();
  res.json(db.products || []);
});

// ✅ POST a product (protected)
app.post('/api/products', authenticateToken, (req, res) => {
  const db = readDB();
  const { name, price, imageUrl, description, category } = req.body;

  if (!name || isNaN(price)) {
    return res.status(400).json({ message: "Name and valid price are required" });
  }

  const newProduct = {
    id: uuidv4(),
    name,
    price,
    image: imageUrl || "",
    description: description || "",
    category: category || ""
  };

  db.products.push(newProduct);
  writeDB(db);
  res.status(201).json(newProduct);
});

// ✅ PUT update product (protected)
app.put('/api/products/:id', authenticateToken, (req, res) => {
  const db = readDB();
  const { id } = req.params;
  const { name, price, imageUrl, description, category } = req.body;

  const product = db.products.find(p => p.id === id);
  if (!product) return res.status(404).json({ message: 'Product not found' });

  if (name !== undefined) product.name = name;
  if (price !== undefined) product.price = price;
  if (imageUrl !== undefined) product.image = imageUrl;
  if (description !== undefined) product.description = description;
  if (category !== undefined) product.category = category;

  writeDB(db);
  res.json(product);
});

// ✅ DELETE product (protected)
app.delete('/api/products/:id', authenticateToken, (req, res) => {
  const db = readDB();
  const index = db.products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Product not found' });

  const deleted = db.products.splice(index, 1);
  writeDB(db);
  res.json({ message: 'Product deleted', deleted: deleted[0] });
});

// ✅ POST order (checkout) - protected
app.post('/api/orders', authenticateToken, (req, res) => {
  const { cart } = req.body;
  if (!Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ message: "Cart is empty or invalid" });
  }

  const db = readDB();
  const user = req.user;

  const newOrder = {
    id: uuidv4(),
    userId: user.id,
    username: user.username,
    items: cart,
    total: cart.reduce((sum, item) => sum + (item.price || 0), 0),
    date: new Date().toISOString()
  };

  db.orders = db.orders || [];
  db.orders.push(newOrder);
  writeDB(db);

  res.status(201).json({ message: "Order placed successfully", order: newOrder });
});

// GET orders for the logged-in user
app.get('/api/orders', authenticateToken, (req, res) => {
  const db = readDB();
  const user = req.user;

  const userOrders = (db.orders || []).filter(order => order.userId === user.id);
  res.json(userOrders);
});

// GET all orders (admin only)
app.get('/api/admin/orders', authenticateToken, (req, res) => {
  const db = readDB();
  const user = req.user;

  if (!user.isAdmin) {
    return res.status(403).json({ message: "Access denied" });
  }

  res.json(db.orders || []);
});


// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error('Global Error:', err.stack);
  res.status(500).json({ message: 'Something went wrong on the server!' });
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
