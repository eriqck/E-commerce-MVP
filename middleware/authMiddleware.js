const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key'; // Use the same as in auth.js

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) return res.status(401).json({ message: 'Token required' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid or expired token' });
    req.user = user; // Now accessible in your route
    next();
  });
}

module.exports = authenticateToken;
