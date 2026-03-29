const FamilyGroup = require('../models/FamilyGroup');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Create a family group
// @route   POST /api/family
// @access  Private
const createFamily = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const group = await FamilyGroup.create({
    name,
    adminId: req.user._id,
    members: [req.user._id],
  });
  res.status(201).json(group);
});

// @desc    Get family members and their status
// @route   GET /api/family/members
// @access  Private
const getFamilyMembers = asyncHandler(async (req, res) => {
  const group = await FamilyGroup.findOne({ members: req.user._id }).populate('members', 'name email phone');
  if (!group) return res.json([]);

  res.json(group.members);
});

// @desc    Invite member to family
// @route   POST /api/family/invite
// @access  Private
const inviteMember = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const userToInvite = await User.findOne({ email });

  if (!userToInvite) {
    res.status(404);
    throw new Error('User not found');
  }

  const group = await FamilyGroup.findOne({ adminId: req.user._id });
  if (!group) {
    res.status(404);
    throw new Error('Family group not found or user is not admin');
  }

  if (!group.members.includes(userToInvite._id)) {
    group.members.push(userToInvite._id);
    await group.save();
  }

  res.json({ message: 'Invited successfully', group });
});

module.exports = { createFamily, getFamilyMembers, inviteMember };
