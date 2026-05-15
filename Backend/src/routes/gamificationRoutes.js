const express = require('express');
const router = express.Router();
const { updateStreak, awardPoints } = require('../controllers/gamificationController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.post('/streak', protect, updateStreak);
router.post('/award', protect, authorize('Admin'), awardPoints);

module.exports = router;