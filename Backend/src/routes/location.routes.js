const locationController = require('../controllers/location.controller');
const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', locationController.getAllLocations);
router.get('/:id', locationController.getLocationById);
router.post('/create', upload.single('image'), locationController.createLocation);
router.put('/update/:id', upload.single('image'), locationController.updateLocation);
router.delete('/delete/:id', locationController.deleteLocation);

module.exports = router;