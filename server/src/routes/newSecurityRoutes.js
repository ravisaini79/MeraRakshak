const express = require('express');
const { createSecurityEvent, getUserSecurityEvents } = require('../controllers/securityController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: AdvancedSecurity
 *   description: User-level advanced security tracking
 */

/**
 * @swagger
 * /api/security-events:
 *   post:
 *     summary: Create a user-level security event
 *     tags: [AdvancedSecurity]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/SecurityEvent'
 *     responses:
 *       201:
 *         description: Event stored
 */
router.post('/', protect, upload.single('image'), createSecurityEvent);

/**
 * @swagger
 * /api/security-events/{userId}:
 *   get:
 *     summary: Get user-level security events
 *     tags: [AdvancedSecurity]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of user events
 */
router.get('/:userId', protect, getUserSecurityEvents);

module.exports = router;
