const express = require('express');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const DB_FILE = 'db.json';
const SECRET_KEY = 'your_secret_key'; // Replace with process.env.SECRET_KEY in production

function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE));
}

function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// REGISTER
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const db = readDB();

  if (db.users.find(user => user.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    id: Date.now(),
    username,
    password: hashedPassword,
    isAdmin: false // By default, users are not admins
  };

  db.users.push(newUser);
  writeDB(db);

  res.status(201).json({ message: 'User registered successfully' });
});

// LOGIN
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const db = readDB();

  const user = db.users.find(u => u.username === username);
  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, isAdmin: user.isAdmin || false },
    SECRET_KEY,
    { expiresIn: '1h' }
  );

  res.json({ token, isAdmin: user.isAdmin || false });
});

module.exports = router;
