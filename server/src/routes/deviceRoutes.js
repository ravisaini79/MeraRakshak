const express = require('express');
const { registerDevice, getDevices, triggerAlarm, lockDevice, ringDevice } = require('../controllers/deviceController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Devices
 *   description: Device management and quick actions
 */

/**
 * @swagger
 * /api/devices:
 *   get:
 *     summary: Get user devices
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user devices
 *   post:
 *     summary: Register a new device
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Device'
 *     responses:
 *       201:
 *         description: Device registered successfully
 */
router.route('/')
  .post(protect, registerDevice)
  .get(protect, getDevices);

/**
 * @swagger
 * /api/devices/{id}/alarm:
 *   post:
 *     summary: Trigger alarm on device
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The device ID
 *     responses:
 *       200:
 *         description: Alarm triggered
 */
router.post('/:id/alarm', protect, triggerAlarm);

/**
 * @swagger
 * /api/devices/{id}/lock:
 *   post:
 *     summary: Lock device
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
 *         description: Device locked
 */
router.post('/:id/lock', protect, lockDevice);

/**
 * @swagger
 * /api/devices/{id}/ring:
 *   post:
 *     summary: Ring device
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
 *         description: Device ringing
 */
router.post('/:id/ring', protect, ringDevice);

module.exports = router;
