const express = require('express');
const { addContact, getContacts } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: Device contacts syncing
 */

/**
 * @swagger
 * /api/contacts:
 *   post:
 *     summary: Add a new contact
 *     tags: [Contacts]
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
 *               callerImg:
 *                 type: string
 *     responses:
 *       201:
 *         description: Contact added successfully
 *   get:
 *     summary: Get synced contacts
 *     tags: [Contacts]
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
 *         description: List of contacts
 */
router.route('/')
  .post(protect, addContact)
  .get(protect, getContacts);

module.exports = router;
