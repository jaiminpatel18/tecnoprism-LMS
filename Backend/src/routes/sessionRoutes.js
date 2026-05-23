const express = require('express');
const router = express.Router();
const {
  createSession,
  getSessions,
  getSessionById,
  registerForSession,
  markSessionLive,
  markAttendance,
  sendSessionReminders,
  completeSession,
  submitSessionFeedback,
} = require('../controllers/sessionController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, getSessions)
  .post(protect, authorize('Admin', 'Expert'), createSession);

router.route('/:id')
  .get(protect, getSessionById);

router.route('/:id/register')
  .post(protect, registerForSession);

router.route('/:id/live')
  .post(protect, authorize('Admin', 'Expert'), markSessionLive);

router.route('/:id/attendance')
  .post(protect, authorize('Admin', 'Expert'), markAttendance);

router.route('/:id/reminders/send')
  .post(protect, authorize('Admin', 'Expert'), sendSessionReminders);

router.route('/:id/complete')
  .post(protect, authorize('Admin', 'Expert'), completeSession);

router.route('/:id/feedback')
  .post(protect, submitSessionFeedback);

module.exports = router;
