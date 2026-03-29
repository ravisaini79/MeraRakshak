const mongoose = require('mongoose');

const callUserSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  callerName: { type: String },
  callerImg: { type: String }, // Storing Cloudinary/External URL
  callNumber: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('CallUser', callUserSchema);
