//import  Express, Bcrypt, and JWT
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//import User model
const User = require('../models/User'); // User model

//new route
const router = express.Router();


// LOGIN user
// POST /login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // validate password
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // create JWT token
    const token = jwt.sign(
      { id: user._id,name: user.name, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// REGISTER new user
// POST /register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // create user with name
    const newUser = new User({
      name,
      email,
      passwordHash,
      role: role || 'user'
    });

    await newUser.save();

    res.json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Export the router
module.exports = router;
