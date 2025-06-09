const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const authenticateToken = require('./middleware/authMiddleware');
const authRoutes = require('./routes/auth');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_FILE = 'db.json';

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Connect auth routes
app.use('/api', authRoutes);

// Helper functions
function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// GET all products (public)
app.get('/api/products', (req, res) => {
  const db = readDB();
  res.json(db.products);
});

// POST a product (protected)
app.post('/api/products', authenticateToken, (req, res) => {
  const db = readDB();
  const { name, price, imageUrl, description } = req.body;

  if (!name || isNaN(price)) {
    return res.status(400).json({ message: "Name and valid price are required" });
  }

  const newProduct = {
    id: uuidv4(),
    name,
    price,
    image: imageUrl || "",
    description: description || ""
  };

  db.products.push(newProduct);
  writeDB(db);
  res.status(201).json(newProduct);
});

// PUT update product by ID (protected)
app.put('/api/products/:id', authenticateToken, (req, res) => {
  const db = readDB();
  const index = db.products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Product not found' });

  const { name, price } = req.body;
  db.products[index] = { ...db.products[index], name, price };
  writeDB(db);
  res.json(db.products[index]);
});

// DELETE product by ID (protected)
app.delete('/api/products/:id', authenticateToken, (req, res) => {
  const db = readDB();
  const index = db.products.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Product not found' });

  const deleted = db.products.splice(index, 1);
  writeDB(db);
  res.json({ message: 'Product deleted', deleted: deleted[0] });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
