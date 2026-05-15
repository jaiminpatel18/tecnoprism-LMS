const User = require('../models/User');

// @desc    Get top users by XP (All time)
// @route   GET /api/leaderboard
// @access  Private
const getLeaderboard = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    
    // Sort descending by xpPoints
    const topUsers = await User.find({})
      .sort({ xpPoints: -1 })
      .limit(limit)
      .select('firstName lastName profilePicture xpPoints currentStreak role');

    res.json({ success: true, data: topUsers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getLeaderboard
};