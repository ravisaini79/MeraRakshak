const Contact = require('../models/Contact');
const asyncHandler = require('../middleware/asyncHandler');

// @desc    Add a new contact
// @route   POST /api/contacts
// @access  Private
const addContact = asyncHandler(async (req, res) => {
  const { callerName, callerNo, callerImg } = req.body;

  if (!callerNo) {
    res.status(400);
    throw new Error('Please provide callerNo');
  }

  const contact = await Contact.create({
    userId: req.user._id,
    deviceId: req.deviceId,
    callerName,
    callerNo,
    callerImg,
  });

  res.status(201).json(contact);
});

// @desc    Get contacts
// @route   GET /api/contacts
// @access  Private
const getContacts = asyncHandler(async (req, res) => {
  const deviceId = req.query.deviceId || req.deviceId;

  if (!deviceId) {
    res.status(400);
    throw new Error('Device ID is required');
  }

  const contacts = await Contact.find({ userId: req.user._id, deviceId });
  res.json(contacts);
});

module.exports = { addContact, getContacts };
