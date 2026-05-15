const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  period: { type: String, enum: ['All-Time', 'Weekly', 'Monthly'], default: 'All-Time' },
  periodDate: { type: Date, default: Date.now }, // Used to compute week/month ranges
  score: { type: Number, default: 0 },
  category: { type: String, default: 'General' }
}, { timestamps: true });

// Prevent duplicate entries for the same user in a specific period
leaderboardSchema.index({ user: 1, period: 1, periodDate: 1 }, { unique: true });

module.exports = mongoose.model('Leaderboard', leaderboardSchema);