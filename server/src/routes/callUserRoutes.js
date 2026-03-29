const express = require('express');
const { createCallUser, getUserCallUsers } = require('../controllers/callUserController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: CallUsers
 *   description: Frequent caller data logging
 */

/**
 * @swagger
 * /api/call-users:
 *   post:
 *     summary: Store a caller record
 *     tags: [CallUsers]
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
 *               callerName:
 *                 type: string
 *               callerImg:
 *                 type: string
 *               callNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: Caller created
 */
router.post('/', protect, createCallUser);

/**
 * @swagger
 * /api/call-users/{userId}:
 *   get:
 *     summary: Get all stored callers for a user
 *     tags: [CallUsers]
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
 *         description: List of caller users
 */
router.get('/:userId', protect, getUserCallUsers);

module.exports = router;
