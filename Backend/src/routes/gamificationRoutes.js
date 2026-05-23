const express = require('express');
const router = express.Router();
const {
  updateStreak,
  awardPoints,
  getDashboardSummary,
  getProfileSummary,
  getCertificates,
} = require('../controllers/gamificationController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.get('/dashboard', protect, getDashboardSummary);
router.get('/profile', protect, getProfileSummary);
router.get('/certificates', protect, getCertificates);
router.post('/streak', protect, updateStreak);
router.post('/award', protect, authorize('Admin'), awardPoints);

module.exports = router;
