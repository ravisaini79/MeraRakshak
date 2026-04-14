const express = require('express');
const { createFamily, getFamilyMembers, inviteMember } = require('../controllers/familyController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Family
 *   description: Family sharing and member management
 */

/**
 * @swagger
 * /api/family:
 *   post:
 *     summary: Create a family group
 *     tags: [Family]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FamilyGroup'
 *     responses:
 *       201:
 *         description: Family group created
 */
router.route('/')
  .post(protect, createFamily);

/**
 * @swagger
 * /api/family/members:
 *   get:
 *     summary: Get family members
 *     tags: [Family]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of family members
 */
router.get('/members', protect, getFamilyMembers);

/**
 * @swagger
 * /api/family/invite:
 *   post:
 *     summary: Invite a member to family
 *     tags: [Family]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Invitation sent
 */
router.post('/invite', protect, inviteMember);

module.exports = router;
