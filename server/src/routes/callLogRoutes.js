const express = require('express');
const { addCallLog, getCallLogs } = require('../controllers/callLogController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: CallLogs
 *   description: Device call logs syncing
 */

/**
 * @swagger
 * /api/call-logs:
 *   post:
 *     summary: Add a new call log
 *     tags: [CallLogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               callerName:
 *                 type: string
 *               callerNo:
 *                 type: string
 *               callType:
 *                 type: string
 *               callDuration:
 *                 type: string
 *               dateTime:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Call log added successfully
 *   get:
 *     summary: Get synced call logs
 *     tags: [CallLogs]
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
 *         description: List of call logs
 */
router.route('/')
  .post(protect, addCallLog)
  .get(protect, getCallLogs);

module.exports = router;
