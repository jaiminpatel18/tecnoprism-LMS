const User = require('../models/User');
const Course = require('../models/Course');
const Notification = require('../models/Notification');

const calculateStreak = async (user) => {
  const now = new Date();
  const lastActive = new Date(user.lastActive);

  now.setHours(0, 0, 0, 0);
  lastActive.setHours(0, 0, 0, 0);

  const diffTime = Math.abs(now - lastActive);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    user.currentStreak += 1;
    if (user.currentStreak > user.longestStreak) {
      user.longestStreak = user.currentStreak;
    }
  } else if (diffDays > 1) {
    user.currentStreak = 1;
  }

  user.lastActive = new Date();
  return user;
};

const buildEnrollmentSummary = (enrollment) => {
  const course = enrollment.course;
  const totalLessons = (course.modules || []).reduce(
    (sum, module) => sum + ((module.lessons || []).length || 0),
    0,
  );

  return {
    courseId: course._id,
    title: course.title,
    thumbnail: course.thumbnail,
    category: course.category,
    level: course.level,
    pointsReward: course.pointsReward,
    progress: enrollment.progress || 0,
    isCompleted: enrollment.isCompleted || false,
    completedLessons: enrollment.completedLessons || [],
    totalLessons,
    certificateId: enrollment.certificateId || null,
    lastAccessedLesson: enrollment.lastAccessedLesson || null,
  };
};

const getDashboardSummary = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'enrolledCourses.course',
        select: 'title thumbnail category level modules pointsReward',
      })
      .populate({ path: 'badges.badge', select: 'name description icon' })
      .populate({ path: 'certificates.course', select: 'title category' })
      .select(
        'firstName lastName role xpPoints coins currentStreak longestStreak enrolledCourses completedCourses badges certificates',
      );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const enrolledCourses = (user.enrolledCourses || [])
      .filter((enrollment) => enrollment.course)
      .map(buildEnrollmentSummary);

    const enrolledIds = enrolledCourses.map((item) => item.courseId);

    const [leaderboardRank, topUsers, recommendedCourses, recentNotifications] = await Promise.all([
      User.countDocuments({ xpPoints: { $gt: user.xpPoints } }).then((count) => count + 1),
      User.find({})
        .sort({ xpPoints: -1 })
        .limit(5)
        .select('firstName lastName xpPoints currentStreak role department'),
      Course.find({ isPublished: true, _id: { $nin: enrolledIds } })
        .limit(3)
        .select('title category learningDomain technologies level pointsReward thumbnail'),
      Notification.find({ user: user._id })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title message type createdAt link'),
    ]);

    const completedCount = enrolledCourses.filter((course) => course.isCompleted).length;
    const inProgressCount = enrolledCourses.filter((course) => !course.isCompleted && course.progress > 0).length;
    const upcomingCount = Math.max(enrolledCourses.length - completedCount - inProgressCount, 0);

    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          xpPoints: user.xpPoints,
          coins: user.coins,
          currentStreak: user.currentStreak,
          longestStreak: user.longestStreak,
        },
        stats: {
          leaderboardRank,
          completedCourses: user.completedCourses.length,
          badges: user.badges.length,
          certificates: user.certificates.length,
        },
        enrolledCourses,
        pathBreakdown: {
          completed: completedCount,
          inProgress: inProgressCount,
          upcoming: upcomingCount,
        },
        badges: user.badges
          .map((entry) => entry.badge)
          .filter((badge) => badge && badge.name)
          .map((badge) => ({
            _id: badge._id,
            name: badge.name,
            description: badge.description,
            icon: badge.icon,
          })),
        recommendedCourses,
        leaderboardPreview: topUsers,
        recentNotifications,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProfileSummary = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'enrolledCourses.course',
        select: 'title category level pointsReward modules',
      })
      .populate({ path: 'completedCourses', select: 'title category level pointsReward' })
      .populate({ path: 'badges.badge', select: 'name description icon' })
      .populate({ path: 'certificates.course', select: 'title category' });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const recentActivity = await Notification.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(8)
      .select('title message type createdAt');

    const enrolledCourses = (user.enrolledCourses || [])
      .filter((enrollment) => enrollment.course)
      .map(buildEnrollmentSummary);

    res.json({
      success: true,
      data: {
        profile: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          department: user.department,
          designation: user.designation,
          xpPoints: user.xpPoints,
          coins: user.coins,
          currentStreak: user.currentStreak,
          longestStreak: user.longestStreak,
          profilePicture: user.profilePicture,
        },
        enrolledCourses,
        completedCourses: user.completedCourses || [],
        badges: (user.badges || [])
          .map((entry) => entry.badge)
          .filter((badge) => badge && badge.name)
          .map((badge) => ({
            _id: badge._id,
            name: badge.name,
            description: badge.description,
            icon: badge.icon,
          })),
        certificates: (user.certificates || []).map((certificate) => ({
          _id: certificate._id,
          certificateId: certificate.certificateId,
          title: certificate.title,
          issuedAt: certificate.issuedAt,
          course: certificate.course,
        })),
        stats: {
          completedCourses: user.completedCourses.length,
          enrolledCourses: user.enrolledCourses.length,
          badges: user.badges.length,
          certificates: user.certificates.length,
        },
        activity: recentActivity,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getCertificates = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({ path: 'certificates.course', select: 'title category level pointsReward' })
      .select('certificates xpPoints completedCourses');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: user.certificates || [],
      meta: {
        totalCertificates: (user.certificates || []).length,
        completedCourses: (user.completedCourses || []).length,
        totalXp: user.xpPoints || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateStreak = async (req, res) => {
  try {
    let user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user = await calculateStreak(user);
    await user.save();

    res.json({
      success: true,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const awardPoints = async (req, res) => {
  try {
    const { userId, xpAmount, reason } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.xpPoints += Number(xpAmount);
    user.coins += Math.floor(Number(xpAmount) / 10);
    await user.save();

    await Notification.create({
      user: user._id,
      title: 'Points Awarded!',
      message: `You have been awarded ${xpAmount} XP points: ${reason || 'Great job!'}`,
      type: 'GAMIFICATION',
      link: '/profile',
    });

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  updateStreak,
  awardPoints,
  getDashboardSummary,
  getProfileSummary,
  getCertificates,
};
