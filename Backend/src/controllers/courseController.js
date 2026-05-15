const Course = require('../models/Course');
const User = require('../models/User');

// @desc    Create a new course
// @route   POST /api/courses
// @access  Private (Admin, Expert)
const createCourse = async (req, res) => {
  try {
    const { title, description, thumbnail, category, level, modules, pointsReward } = req.body;

    const course = new Course({
      title,
      description,
      thumbnail,
      category,
      level,
      modules,
      pointsReward,
      instructor: req.user._id,
      isPublished: true
    });

    const createdCourse = await course.save();
    res.status(201).json({ success: true, data: createdCourse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate('instructor', 'firstName lastName profilePicture');
    res.json({ success: true, count: courses.length, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single course by ID
// @route   GET /api/courses/:id
// @access  Private
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'firstName lastName profilePicture');
    
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    
    res.json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private
const enrollCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const user = await User.findById(req.user._id);

    // Check if already enrolled
    const alreadyEnrolled = user.enrolledCourses.find(c => c.course.toString() === courseId);
    if (alreadyEnrolled) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }

    // Add to user enrolledCourses
    user.enrolledCourses.push({ course: courseId, progress: 0 });
    await user.save();

    // Add to course enrolledUsers
    course.enrolledUsers.push(req.user._id);
    await course.save();

    res.json({ success: true, message: 'Successfully enrolled in course' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  enrollCourse
};
