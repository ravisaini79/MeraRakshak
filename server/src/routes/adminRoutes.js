const express = require('express');
const router = express.Router();
const { 
  getUsers, 
  getDevices, 
  getEvents, 
  toggleBlockUser, 
  getStats 
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('superadmin'));

router.get('/users', getUsers);
router.get('/devices', getDevices);
router.get('/events', getEvents);
router.get('/stats', getStats);
router.put('/block-user/:id', toggleBlockUser);

module.exports = router;
