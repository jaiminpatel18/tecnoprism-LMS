const Course = require('../models/Course');
const User = require('../models/User');
const Badge = require('../models/Badge');
const Notification = require('../models/Notification');

const getCourseLessonIds = (course) =>
  (course.modules || []).flatMap((module) => (module.lessons || []).map((lesson) => lesson._id.toString()));

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
      isPublished: true,
    });

    const createdCourse = await course.save();
    res.status(201).json({ success: true, data: createdCourse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCourses = async (req, res) => {
  try {
    const [courses, user] = await Promise.all([
      Course.find({ isPublished: true }).populate('instructor', 'firstName lastName profilePicture'),
      User.findById(req.user._id).select('enrolledCourses completedCourses'),
    ]);

    const enrollmentMap = new Map(
      (user?.enrolledCourses || []).map((enrollment) => [enrollment.course.toString(), enrollment]),
    );
    const completedSet = new Set((user?.completedCourses || []).map((courseId) => courseId.toString()));

    const data = courses.map((course) => {
      const courseObj = course.toObject();
      const enrollment = enrollmentMap.get(courseObj._id.toString());
      return {
        ...courseObj,
        userEnrollment: enrollment
          ? {
              progress: enrollment.progress,
              isCompleted: enrollment.isCompleted,
              completedLessons: enrollment.completedLessons || [],
              certificateId: enrollment.certificateId || null,
              lastAccessedLesson: enrollment.lastAccessedLesson || null,
            }
          : null,
        isEnrolled: Boolean(enrollment),
        isCompleted: completedSet.has(courseObj._id.toString()),
      };
    });

    res.json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const [course, user] = await Promise.all([
      Course.findById(req.params.id).populate('instructor', 'firstName lastName profilePicture'),
      User.findById(req.user._id).select('enrolledCourses completedCourses'),
    ]);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    const enrollment = (user?.enrolledCourses || []).find(
      (item) => item.course.toString() === course._id.toString(),
    );
    const isCompleted = (user?.completedCourses || []).some(
      (courseId) => courseId.toString() === course._id.toString(),
    );

    res.json({
      success: true,
      data: {
        ...course.toObject(),
        userEnrollment: enrollment
          ? {
              progress: enrollment.progress,
              isCompleted: enrollment.isCompleted,
              completedLessons: enrollment.completedLessons || [],
              certificateId: enrollment.certificateId || null,
              lastAccessedLesson: enrollment.lastAccessedLesson || null,
            }
          : null,
        isEnrolled: Boolean(enrollment),
        isCompleted,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getEnrolledCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'enrolledCourses.course',
        populate: { path: 'instructor', select: 'firstName lastName profilePicture' },
      })
      .select('enrolledCourses');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const data = (user.enrolledCourses || [])
      .filter((enrollment) => enrollment.course)
      .map((enrollment) => {
        const lessonCount = getCourseLessonIds(enrollment.course).length;
        return {
          enrollmentId: enrollment._id,
          progress: enrollment.progress || 0,
          isCompleted: enrollment.isCompleted || false,
          completedAt: enrollment.completedAt || null,
          certificateId: enrollment.certificateId || null,
          completedLessons: enrollment.completedLessons || [],
          lessonCount,
          course: enrollment.course,
          lastAccessedLesson: enrollment.lastAccessedLesson || null,
        };
      })
      .sort((a, b) => {
        const aDate = new Date(a.lastAccessedLesson?.updatedAt || a.course.updatedAt || a.course.createdAt).getTime();
        const bDate = new Date(b.lastAccessedLesson?.updatedAt || b.course.updatedAt || b.course.createdAt).getTime();
        return bDate - aDate;
      });

    res.json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const enrollCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const [course, user] = await Promise.all([Course.findById(courseId), User.findById(req.user._id)]);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const alreadyEnrolled = user.enrolledCourses.find((item) => item.course.toString() === courseId);
    if (alreadyEnrolled) {
      return res.status(200).json({ success: true, message: 'Already enrolled in this course' });
    }

    user.enrolledCourses.push({
      course: courseId,
      progress: 0,
      completedLessons: [],
      isCompleted: false,
    });

    if (!course.enrolledUsers.some((userId) => userId.toString() === req.user._id.toString())) {
      course.enrolledUsers.push(req.user._id);
    }

    await Promise.all([
      user.save(),
      course.save(),
      Notification.create({
        user: user._id,
        title: 'Course Enrolled',
        message: `You are now enrolled in ${course.title}. Start learning to earn ${course.pointsReward || 0} XP.`,
        type: 'COURSE',
        link: `/courses/${course._id}`,
      }),
    ]);

    res.json({ success: true, message: 'Successfully enrolled in course' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateCourseProgress = async (req, res) => {
  try {
    const courseId = req.params.id;
    const { moduleId, lessonId, completed = true } = req.body;

    const [course, user] = await Promise.all([Course.findById(courseId), User.findById(req.user._id)]);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const moduleExists = (course.modules || []).some((module) => module._id.toString() === String(moduleId));
    const lessonExists = (course.modules || []).some((module) =>
      (module.lessons || []).some((lesson) => lesson._id.toString() === String(lessonId)),
    );

    if (!moduleExists || !lessonExists) {
      return res.status(400).json({ success: false, message: 'Invalid module or lesson for this course' });
    }

    const enrollment = user.enrolledCourses.find((item) => item.course.toString() === courseId);
    if (!enrollment) {
      return res.status(400).json({ success: false, message: 'You must enroll before updating progress' });
    }

    const validLessonIds = new Set(getCourseLessonIds(course));
    enrollment.completedLessons = (enrollment.completedLessons || []).filter((item) => validLessonIds.has(item));

    if (completed && !enrollment.completedLessons.includes(String(lessonId))) {
      enrollment.completedLessons.push(String(lessonId));
    }

    enrollment.lastAccessedLesson = {
      moduleId: String(moduleId),
      lessonId: String(lessonId),
      updatedAt: new Date(),
    };

    const totalLessons = Math.max(validLessonIds.size, 1);
    const completedCount = Math.min(enrollment.completedLessons.length, totalLessons);
    const progress = Math.round((completedCount / totalLessons) * 100);
    enrollment.progress = progress;

    let awarded = null;

    if (progress >= 100 && !enrollment.isCompleted) {
      enrollment.isCompleted = true;
      enrollment.completedAt = new Date();

      if (!user.completedCourses.some((item) => item.toString() === courseId)) {
        user.completedCourses.push(course._id);
      }

      const xpReward = Number(course.pointsReward || 0);
      user.xpPoints += xpReward;
      user.coins += Math.floor(xpReward / 10);

      const certificateId = `CERT-${course._id.toString().slice(-6).toUpperCase()}-${Date.now()
        .toString()
        .slice(-6)}`;
      enrollment.certificateId = certificateId;

      if (!user.certificates.some((item) => item.course.toString() === courseId)) {
        user.certificates.push({
          course: course._id,
          title: `${course.title} Completion Certificate`,
          certificateId,
          issuedAt: new Date(),
        });
      }

      const badgeName = `Course Conqueror: ${course.title}`;
      let badge = await Badge.findOne({ name: badgeName });
      if (!badge) {
        badge = await Badge.create({
          name: badgeName,
          description: `Awarded for successfully completing ${course.title}.`,
          icon: '🏆',
          criteriaType: 'COURSES_COMPLETED',
          criteriaTarget: 1,
        });
      }

      if (!user.badges.some((entry) => entry.badge.toString() === badge._id.toString())) {
        user.badges.push({ badge: badge._id, earnedAt: new Date() });
      }

      await Notification.insertMany([
        {
          user: user._id,
          title: 'Course Completed',
          message: `You completed ${course.title} and earned ${xpReward} XP.`,
          type: 'COURSE',
          link: `/courses/${course._id}`,
        },
        {
          user: user._id,
          title: 'Certificate Issued',
          message: `Your certificate (${certificateId}) for ${course.title} is now available.`,
          type: 'SUCCESS',
          link: '/certificates',
        },
        {
          user: user._id,
          title: 'Badge Unlocked',
          message: `You unlocked "${badge.name}".`,
          type: 'GAMIFICATION',
          link: '/profile',
        },
      ]);

      awarded = {
        xpReward,
        coinsReward: Math.floor(xpReward / 10),
        certificateId,
        badge: badge.name,
      };
    }

    await user.save();

    res.json({
      success: true,
      data: {
        progress: enrollment.progress,
        completedLessons: enrollment.completedLessons,
        isCompleted: enrollment.isCompleted,
        completedAt: enrollment.completedAt || null,
        certificateId: enrollment.certificateId || null,
        lastAccessedLesson: enrollment.lastAccessedLesson || null,
        xpPoints: user.xpPoints,
        coins: user.coins,
        awarded,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  getEnrolledCourses,
  enrollCourse,
  updateCourseProgress,
};
