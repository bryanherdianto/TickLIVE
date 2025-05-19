const seatController = require('../controllers/seat.controller');
const express = require('express');
const router = express.Router();

// Route to get all seats
router.get('/', seatController.getAllSeats);
router.get('/:id', seatController.getSeatById);
router.post('/create', seatController.createSeat);
router.put('/update/:id', seatController.updateSeat);
router.delete('/delete/:id', seatController.deleteSeat);

module.exports = router;