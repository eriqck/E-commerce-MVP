const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const authenticateToken = require('./middleware/authMiddleware');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = 3000;
const DB_FILE = 'db.json';

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json()); // Parses JSON bodies

// Connect auth routes
app.use('/api', authRoutes);

// Helper functions to read and write the JSON "database"
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
app.post('/api/products', (req, res) => {
  const { name, price, image, description } = req.body;

  if (!name || isNaN(price)) {
    return res.status(400).json({ message: "Name and valid price are required" });
  }

  const newProduct = {
    id: uuidv4(),
    name,
    price,
    image: image || "",         // Add image field
    description: description || ""  // Add description field
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// DELETE a product by ID (protected)
app.delete('/api/products/:id', authenticateToken, (req, res) => {
  const db = readDB();
  const productId = req.params.id;

  const index = db.products.findIndex(p => p.id === productId);
  if (index === -1) {
    return res.status(404).json({ message: 'Product not found' });
  }

  db.products.splice(index, 1); // Remove the product
  writeDB(db);

  res.json({ message: 'Product deleted successfully' });
});

// PUT update product by ID (protected)
app.put('/api/products/:id', authenticateToken, (req, res) => {
  const db = readDB();
  const productIndex = db.products.findIndex(p => p.id === req.params.id);
  if (productIndex === -1) return res.status(404).json({ message: 'Product not found' });

  const { name, price } = req.body;
  db.products[productIndex] = { ...db.products[productIndex], name, price };
  writeDB(db);
  res.json(db.products[productIndex]);
});

// DELETE product by ID (protected)
app.delete('/api/products/:id', authenticateToken, (req, res) => {
  const db = readDB();
  const productIndex = db.products.findIndex(p => p.id === req.params.id);
  if (productIndex === -1) return res.status(404).json({ message: 'Product not found' });

  const deleted = db.products.splice(productIndex, 1);
  writeDB(db);
  res.json({ message: 'Product deleted', deleted: deleted[0] });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
