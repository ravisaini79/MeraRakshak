const express = require('express');
const { createFamily, getFamilyMembers, inviteMember } = require('../controllers/familyController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .post(protect, createFamily);

router.get('/members', protect, getFamilyMembers);
router.post('/invite', protect, inviteMember);

module.exports = router;
