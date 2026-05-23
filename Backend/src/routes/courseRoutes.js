const express = require('express');
const router = express.Router();
const {
  createCourse,
  getCourses,
  getCourseById,
  getEnrolledCourses,
  enrollCourse,
  updateCourseProgress,
} = require('../controllers/courseController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, getCourses)
  .post(protect, authorize('Admin', 'Expert'), createCourse);

router.get('/enrolled/me', protect, getEnrolledCourses);

router.route('/:id')
  .get(protect, getCourseById);

router.route('/:id/enroll')
  .post(protect, enrollCourse);

router.route('/:id/progress')
  .post(protect, updateCourseProgress);

module.exports = router;
