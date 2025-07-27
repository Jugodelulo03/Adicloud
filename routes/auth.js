//import  Express, Bcrypt, and JWT
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//start express app
const app = express();
app.use(express.json());

// simulated database
const users = [
  { email: 'test@example.com', passwordHash: bcrypt.hashSync('123456', 10) }
];

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

//check email
  const user = users.find(u => u.email === email);
  if (!user) 
    return res.status(401).json({ error: 'User not found' }); 

//check password 
  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Incorrect password' });

// create a JWT token
  const token = jwt.sign({ email: user.email }, 'secret123', { expiresIn: '1h' });
  res.json({ token });
});

// Server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
