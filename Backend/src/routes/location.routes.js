const locationController = require('../controllers/location.controller');
const express = require('express');
const router = express.Router();

router.get('/', locationController.getAllLocations);