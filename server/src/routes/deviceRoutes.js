const express = require('express');
const { getDevices, getDeviceById } = require('../controllers/deviceController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Devices
 *   description: Device management
 */

/**
 * @swagger
 * /api/devices:
 *   get:
 *     summary: Get all devices for the logged-in user
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of devices
 */
router.route('/')
  .get(protect, getDevices);

/**
 * @swagger
 * /api/devices/{id}:
 *   get:
 *     summary: Get specific device details
 *     tags: [Devices]
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
 *         description: Device details
 */
router.route('/:id')
  .get(protect, getDeviceById);

module.exports = router;
