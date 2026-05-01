const mongoose = require('mongoose');

const locationHistorySchema = new mongoose.Schema({
  deviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Device', required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  location: { type: String },
  battery: { type: Number },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('LocationHistory', locationHistorySchema);
