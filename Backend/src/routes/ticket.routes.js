const ticketController = require('../controllers/ticket.controller');
const express = require('express');
const router = express.Router();

// Route to get all tickets
router.get('/', ticketController.getAllTickets);
router.get('/:id', ticketController.getTicketById);
router.post('/create', ticketController.createTicket);
router.put('/update/:id', ticketController.updateTicket);
router.delete('/delete/:id', ticketController.deleteTicket);

module.exports = router;