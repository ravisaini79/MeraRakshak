const express = require('express');
const { createRecoveredMessage, getUserMessages, getUserMessagesByPackage } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: RecoveredMessages
 *   description: Tracking captured social media notifications and messages
 */

/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Store a captured message notification
 *     tags: [RecoveredMessages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecoveredMessage'
 *     responses:
 *       201:
 *         description: Recovered notification stored
 */
router.post('/', protect, createRecoveredMessage);

/**
 * @swagger
 * /api/messages/{userId}:
 *   get:
 *     summary: Get captured messages for a user
 *     tags: [RecoveredMessages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: app
 *         schema:
 *           type: string
 *         description: Filter by package/app name (e.g. whatsapp)
 *     responses:
 *       200:
 *         description: List of stored messages
 */
router.get('/:userId', protect, getUserMessages);

/**
 * @swagger
 * /api/messages/{userId}/{packageName}:
 *   get:
 *     summary: Get captured messages by specific package name
 *     tags: [RecoveredMessages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: packageName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Messages from highly specific package
 */
router.get('/:userId/:packageName', protect, getUserMessagesByPackage);

module.exports = router;
