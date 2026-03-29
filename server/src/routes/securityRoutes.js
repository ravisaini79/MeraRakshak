const express = require('express');
const { reportTheft, logSecurityEvent, getSecurityEvents } = require('../controllers/securityController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Security
 *   description: Security events and theft reporting
 */

/**
 * @swagger
 * /api/security/report-theft:
 *   post:
 *     summary: Report device as stolen
 *     tags: [Security]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deviceId:
 *                 type: string
 *               details:
 *                 type: string
 *     responses:
 *       200:
 *         description: Theft reported successfully
 */
router.post('/report-theft', protect, reportTheft);

/**
 * @swagger
 * /api/security/log-event:
 *   post:
 *     summary: Log a security event (e.g. wrong unlock attempt)
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
 *               deviceId:
 *                 type: string
 *               eventType:
 *                 type: string
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Event logged successfully
 */
router.post('/log-event', protect, upload.single('photo'), logSecurityEvent);

/**
 * @swagger
 * /api/security/events:
 *   get:
 *     summary: Get user's security events
 *     tags: [Security]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of security events
 */
router.get('/events', protect, getSecurityEvents);

module.exports = router;
