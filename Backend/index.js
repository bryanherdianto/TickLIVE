const express = require('express');
require('dotenv').config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

corsOptions = {
    origin: 'https://ticklive.vercel.app/', // Replace with your frontend URL
    methods: 'GET,PUT,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

app.use(express.json());
app.use('/user', require('./src/routes/user.routes'))
app.use('/seat', require('./src/routes/seat.routes'))
app.use('/ticket', require('./src/routes/ticket.routes'))
app.use('/event', require('./src/routes/event.routes'))
app.use('/location', require('./src/routes/location.routes'))

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});