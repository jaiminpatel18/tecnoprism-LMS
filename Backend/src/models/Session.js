const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['Registered', 'Present', 'Absent'],
      default: 'Registered',
    },
    markedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const feedbackSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, trim: true, maxlength: 500 },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const sessionSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  expert: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheduledAt: { type: Date, required: true },
  durationMinutes: { type: Number, required: true },
  sessionType: {
    type: String,
    enum: ['Live Workshop', 'AMA', 'Hands-on Lab', 'Expert Talk'],
    default: 'Live Workshop',
  },
  domain: {
    type: String,
    enum: [
      'RPA',
      'Agentic AI',
      'AI Automation',
      'Intelligent Workflows',
      'Enterprise Automation',
      'Process Mining',
      'Generative AI',
      'Autonomous Agents',
      'Workflow Orchestration',
      'Digital Transformation',
    ],
    default: 'AI Automation',
  },
  technologies: [{ type: String, trim: true }],
  meetingLink: { type: String, required: true },
  recordingUrl: { type: String }, // Provided after session
  reminderMinutesBefore: [{ type: Number }],
  remindersSentAt: [{ type: Date }],
  maxAttendees: { type: Number, default: 100 },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  attendance: [attendanceSchema],
  feedbacks: [feedbackSchema],
  averageRating: { type: Number, default: 0 },
  tags: [{ type: String }],
  qaEnabled: { type: Boolean, default: true },
  chatEnabled: { type: Boolean, default: true },
  status: { 
    type: String, 
    enum: ['Upcoming', 'Live', 'Completed', 'Cancelled'], 
    default: 'Upcoming' 
  },
  pointsReward: { type: Number, default: 50 }, // Points for attending
  rewardsDistributed: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Session', sessionSchema);
