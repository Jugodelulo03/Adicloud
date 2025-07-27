const express = require('express');
const app = express();

app.use(express.json());

// importar rutas
app.use('/', require('./routes/auth'));
app.use('/', require('./routes/profile'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));