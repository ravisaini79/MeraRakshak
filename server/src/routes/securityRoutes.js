const express = require('express');
const { reportTheft, logSecurityEvent, getSecurityEvents } = require('../controllers/securityController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');
const router = express.Router();

router.post('/report-theft', protect, reportTheft);
router.post('/log-event', protect, upload.single('photo'), logSecurityEvent);
router.get('/events', protect, getSecurityEvents);

module.exports = router;
