const eventController = require('../controllers/event.controller');
const express = require('express');
const router = express.Router();

router.get('/', eventController.getAllEvents);