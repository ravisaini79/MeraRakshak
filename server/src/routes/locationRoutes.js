const express = require('express');
const { sendLocation, getLocationHistory } = require('../controllers/locationController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, sendLocation);
router.get('/:deviceId', protect, getLocationHistory);

module.exports = router;
