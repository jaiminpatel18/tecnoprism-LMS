const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  icon: { type: String, required: true }, // URL or class string
  criteriaType: { 
    type: String, 
    enum: ['COURSES_COMPLETED', 'STREAK', 'XP_EARNED', 'SESSIONS_ATTENDED', 'BLOGS_WRITTEN'],
    required: true 
  },
  criteriaTarget: { type: Number, required: true } // e.g., 5 courses completed
}, { timestamps: true });

module.exports = mongoose.model('Badge', badgeSchema);
