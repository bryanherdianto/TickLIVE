const express = require('express');
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/user', require('./src/routes/user.routes'))
app.use('/seat', require('./src/routes/seat.routes'))
app.use('/ticket', require('./src/routes/ticket.routes'))
app.use('/event', require('./src/routes/event.routes'))
app.use('/location', require('./src/routes/location.routes'))

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});