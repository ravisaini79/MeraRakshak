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

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Superadmin management operations
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 */
router.get('/users', getUsers);

/**
 * @swagger
 * /api/admin/devices:
 *   get:
 *     summary: Get all devices
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all devices
 */
router.get('/devices', getDevices);

/**
 * @swagger
 * /api/admin/events:
 *   get:
 *     summary: Get all security events
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all events
 */
router.get('/events', getEvents);

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: Get platform statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Platform statistics
 */
router.get('/stats', getStats);

/**
 * @swagger
 * /api/admin/block-user/{id}:
 *   put:
 *     summary: Toggle user block status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User block status toggled
 */
router.put('/block-user/:id', toggleBlockUser);

module.exports = router;
