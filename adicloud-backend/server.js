const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const { authenticateToken } = require('./middleware/authMiddleware');

const app = express();
app.use(express.json());

// ======================
// PRODUCTION CONFIGURATION
// ======================
/*
// configure CORS: allow only frontend hosted on Render
const allowedOrigins = ['https://adicloud-hxf9.onrender.com'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // allow request
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));
*/

// configure CORS: allow all origins (for development purposes)
app.use(cors({
  origin: '*'
}));

// connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));

// apply authentication globally, except for login and register
app.use((req, res, next) => {
  if (['/login', '/register'].includes(req.path)) {
    return next(); // skip auth for login/register
  }
  authenticateToken(req, res, next);
});

// import routes
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/profile'));
app.use('/', require('./routes/assets'));
app.use('/', require('./routes/download'));
app.use('/', require('./routes/requests')); // example: requests route

// start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));