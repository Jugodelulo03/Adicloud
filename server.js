const express = require('express');
const app = express();

app.use(express.json());

// import routes
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/profile'));

// start the server in Render or locally (3000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));