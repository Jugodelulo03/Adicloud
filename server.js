const express = require('express');
const app = express();

app.use(express.json());

// configure CORS: allow only your frontend hosted on Render
const allowedOrigins = ['https://adicloud-hxf9.onrender.com'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // allow request
    } else {
      callback(new Error('Not allowed by CORS')); // block request
    }
  }
}));

// import routes
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/profile'));

// start the server in Render or locally (3000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));