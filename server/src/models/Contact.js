const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
  callerName: { type: String },
  callerNo: { type: String, required: true },
  callerImg: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
