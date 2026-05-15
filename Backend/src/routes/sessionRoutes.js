const express = require('express');
const router = express.Router();
const { createSession, getSessions, registerForSession } = require('../controllers/sessionController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, getSessions)
  .post(protect, authorize('Admin', 'Expert'), createSession);

router.route('/:id/register')
  .post(protect, registerForSession);

module.exports = router;
