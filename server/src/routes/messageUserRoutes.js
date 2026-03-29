const express = require('express');
const { createMessageUser, getUserMessageUsers } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: MessageUsers
 *   description: User messaging profile capture
 */

/**
 * @swagger
 * /api/message-users:
 *   post:
 *     summary: Create captured message user profile
 *     tags: [MessageUsers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               title:
 *                 type: string
 *               lastMessage:
 *                 type: string
 *               time:
 *                 type: string
 *               icon:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message user profile stored
 */
router.post('/', protect, createMessageUser);

/**
 * @swagger
 * /api/message-users/{userId}:
 *   get:
 *     summary: Get message user profiles
 *     tags: [MessageUsers]
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
 *         description: List of message user profiles
 */
router.get('/:userId', protect, getUserMessageUsers);

module.exports = router;
