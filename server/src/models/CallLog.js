const mongoose = require('mongoose');

const callLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userCallNumber: { type: String, required: true },
  date: { type: Date, default: Date.now },
  duration: { type: String },
  callType: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('CallLog', callLogSchema);
