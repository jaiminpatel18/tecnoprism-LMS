const express = require('express');
const router = express.Router();
const { getNotifications, markAllAsRead, markAsRead, createNotification } = require('../controllers/notificationController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, getNotifications)
  .post(protect, authorize('Admin'), createNotification);

router.put('/read', protect, markAllAsRead);
router.put('/:id/read', protect, markAsRead);

module.exports = router;