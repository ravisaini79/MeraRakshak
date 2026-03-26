const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deviceId: { type: String, required: true },
  name: { type: String, required: true },
  model: { type: String, required: true },
  lastActive: { type: Date, default: Date.now },
  status: { type: String, enum: ['Active', 'Stolen'], default: 'Active' },
  pushToken: { type: String },
});

module.exports = mongoose.model('Device', deviceSchema);
