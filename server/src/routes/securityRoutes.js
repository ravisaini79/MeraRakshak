const express = require('express');
const { addSecurityEvent, getSecurityEvents } = require('../controllers/securityController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Security
 *   description: Security events and intruder selfies
 */

/**
 * @swagger
 * /api/security-events:
 *   post:
 *     summary: Upload an intruder selfie and log event
 *     tags: [Security]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               selfieImg:
 *                 type: string
 *                 format: binary
 *               dateTime:
 *                 type: string
 *                 format: date-time
 *               location:
 *                 type: string
 *               tryType:
 *                 type: string
 *               imeiNo:
 *                 type: string
 *               deviceModel:
 *                 type: string
 *     responses:
 *       200:
 *         description: Event recorded successfully
 *   get:
 *     summary: Get all security events
 *     tags: [Security]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: deviceId
 *         schema:
 *           type: string
 *         description: Optional device ID
 *     responses:
 *       200:
 *         description: Array of security events
 */
router.route('/')
  .post(protect, upload.single('selfieImg'), addSecurityEvent)
  .get(protect, getSecurityEvents);

module.exports = router;
