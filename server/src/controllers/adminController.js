const User = require('../models/User');
const Device = require('../models/Device');
const SecurityEvent = require('../models/SecurityEvent');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
});

// @desc    Get all devices
// @route   GET /api/admin/devices
// @access  Private/Admin
exports.getDevices = asyncHandler(async (req, res) => {
  const devices = await Device.find({}).populate('owner', 'name email');
  res.json(devices);
});

// @desc    Get all security events
// @route   GET /api/admin/events
// @access  Private/Admin
exports.getEvents = asyncHandler(async (req, res) => {
  const events = await SecurityEvent.find({}).populate('deviceId');
  res.json(events);
});

// @desc    Toggle user block status
// @route   PUT /api/admin/block-user/:id
// @access  Private/Admin
exports.toggleBlockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (user) {
    if (user.role === 'superadmin') {
      res.status(400);
      throw new Error('Cannot block a superadmin');
    }
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully` });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({ role: 'user' });
  const totalDevices = await Device.countDocuments({});
  const activeDevices = await Device.countDocuments({ status: 'Active' });
  const stolenDevices = await Device.countDocuments({ status: 'Stolen' });
  const totalEvents = await SecurityEvent.countDocuments({});

  res.json({
    totalUsers,
    totalDevices,
    activeDevices,
    stolenDevices,
    totalEvents
  });
});
