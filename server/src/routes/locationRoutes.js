const express = require('express');
const { sendLocation, getLocationHistory } = require('../controllers/locationController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Location
 *   description: Location tracking and history
 */

/**
 * @swagger
 * /api/location:
 *   post:
 *     summary: Send location update
 *     tags: [Location]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Location'
 *     responses:
 *       200:
 *         description: Location updated successfully
 */
router.post('/', protect, sendLocation);

/**
 * @swagger
 * /api/location/{deviceId}:
 *   get:
 *     summary: Get location history for a device
 *     tags: [Location]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Location history retrieved
 */
router.get('/:deviceId', protect, getLocationHistory);

module.exports = router;
