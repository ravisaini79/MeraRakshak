const MessageUser = require('../models/MessageUser');
const RecoveredMessage = require('../models/RecoveredMessage');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Create a message user profile
// @route   POST /api/message-users
// @access  Private
const createMessageUser = asyncHandler(async (req, res) => {
  const { userId, title, lastMessage, time, icon } = req.body;

  if (!userId) {
    res.status(400);
    throw new Error('userId is required');
  }

  const msgUser = await MessageUser.create({
    userId,
    title,
    lastMessage,
    time,
    icon,
  });

  res.status(201).json(msgUser);
});

// @desc    Get message users for a user
// @route   GET /api/message-users/:userId
// @access  Private
const getUserMessageUsers = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (req.user._id.toString() !== userId) {
    res.status(401);
    throw new Error('Not authorized to access this user data');
  }

  const users = await MessageUser.find({ userId }).sort('-createdAt');
  res.json(users);
});

// @desc    Create a recovered message (from notifications)
// @route   POST /api/messages
// @access  Private
const createRecoveredMessage = asyncHandler(async (req, res) => {
  const { userId, packageName, title, message, time, date, icon, notificationId, image } = req.body;

  if (!userId || !packageName) {
    res.status(400);
    throw new Error('userId and packageName are required');
  }

  const recoveredMessage = await RecoveredMessage.create({
    userId,
    packageName,
    title,
    message,
    time,
    date,
    icon,
    notificationId,
    image,
  });

  res.status(201).json(recoveredMessage);
});

// @desc    Get all recovered messages with optional package filtering
// @route   GET /api/messages/:userId?app=whatsapp
// @access  Private
const getUserMessages = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { app } = req.query;

  if (req.user._id.toString() !== userId) {
    res.status(401);
    throw new Error('Not authorized to access these messages');
  }

  const query = { userId };
  if (app) {
    query.packageName = { $regex: new RegExp(app, 'i') };
  }

  const messages = await RecoveredMessage.find(query).sort({ createdAt: -1 });

  res.json(messages);
});

// @desc    Get recovered messages by exact package name
// @route   GET /api/messages/:userId/:packageName
// @access  Private
const getUserMessagesByPackage = asyncHandler(async (req, res) => {
  const { userId, packageName } = req.params;

  if (req.user._id.toString() !== userId) {
    res.status(401);
    throw new Error('Not authorized to access these messages');
  }

  const messages = await RecoveredMessage.find({ userId, packageName }).sort({ createdAt: -1 });

  res.json(messages);
});


module.exports = {
  createMessageUser,
  getUserMessageUsers,
  createRecoveredMessage,
  getUserMessages,
  getUserMessagesByPackage
};
