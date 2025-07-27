const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get('/profile', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token required' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    res.json({ message: `Welcome, ${user.name}! This is your profile.` });
  });
});

module.exports = router;