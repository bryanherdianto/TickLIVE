const eventController = require('../controllers/event.controller');
const express = require('express');
const router = express.Router();

router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);
router.post('/create', eventController.createEvent);
router.put('/update/:id', eventController.updateEvent);
router.delete('/delete/:id', eventController.deleteEvent);

module.exports = router;