const express = require('express');
const { createCallLog, getUserCallLogs } = require('../controllers/callLogController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: CallLogs
 *   description: Tracking user call logs
 */

/**
 * @swagger
 * /api/call-logs:
 *   post:
 *     summary: Create a new call log
 *     tags: [CallLogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CallLog'
 *     responses:
 *       201:
 *         description: Call log created
 */
router.post('/', protect, createCallLog);

/**
 * @swagger
 * /api/call-logs/{userId}:
 *   get:
 *     summary: Get user call logs
 *     tags: [CallLogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by call type (e.g. missed)
 *     responses:
 *       200:
 *         description: List of call logs
 */
router.get('/:userId', protect, getUserCallLogs);

module.exports = router;
