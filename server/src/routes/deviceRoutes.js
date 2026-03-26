const express = require('express');
const { registerDevice, getDevices } = require('../controllers/deviceController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .post(protect, registerDevice)
  .get(protect, getDevices);

module.exports = router;
