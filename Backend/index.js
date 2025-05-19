const express = require('express');
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/user', require('./src/routes/user.routes'))
app.use('/seat', require('./src/routes/seat.routes'))

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});