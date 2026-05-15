const express = require('express');
const router = express.Router();
const { createCourse, getCourses, getCourseById, enrollCourse } = require('../controllers/courseController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protect, getCourses)
  .post(protect, authorize('Admin', 'Expert'), createCourse);

router.route('/:id')
  .get(protect, getCourseById);

router.route('/:id/enroll')
  .post(protect, enrollCourse);

module.exports = router;
