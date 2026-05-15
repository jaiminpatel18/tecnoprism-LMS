const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  expert: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheduledAt: { type: Date, required: true },
  durationMinutes: { type: Number, required: true },
  meetingLink: { type: String, required: true },
  recordingUrl: { type: String }, // Provided after session
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  tags: [{ type: String }],
  status: { 
    type: String, 
    enum: ['Upcoming', 'Live', 'Completed', 'Cancelled'], 
    default: 'Upcoming' 
  },
  pointsReward: { type: Number, default: 50 }, // Points for attending
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
