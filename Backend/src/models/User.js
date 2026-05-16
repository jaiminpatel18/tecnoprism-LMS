const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const enrolledCourseSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  completedLessons: [{ type: String }],
  lastAccessedLesson: {
    moduleId: { type: String },
    lessonId: { type: String },
    updatedAt: { type: Date },
  },
  isCompleted: { type: Boolean, default: false },
  enrolledAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  certificateId: { type: String },
});

const certificateSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  certificateId: { type: String, required: true },
  issuedAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@tecnoprism\.com$/, 
      'Please use a valid Tecnoprism company email address (@tecnoprism.com)'
    ]
  },
  password: { type: String, required: true, select: false },
  role: { 
    type: String, 
    enum: ['Employee', 'Admin', 'Expert'], 
    default: 'Employee' 
  },
  profilePicture: { type: String, default: '' },
  department: { type: String, trim: true },
  designation: { type: String, trim: true },
  
  // Gamification Metrics
  xpPoints: { type: Number, default: 0 },
  coins: { type: Number, default: 0 },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now },
  
  // Progress Tracking
  enrolledCourses: [enrolledCourseSchema],
  completedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  badges: [{
    badge: { type: mongoose.Schema.Types.ObjectId, ref: 'Badge' },
    earnedAt: { type: Date, default: Date.now }
  }],
  certificates: [certificateSchema],
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
