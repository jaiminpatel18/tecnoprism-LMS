const User = require('../models/User');

// Helper to calculate daily streak
const calculateStreak = async (user) => {
  const now = new Date();
  const lastActive = new Date(user.lastActive);
  
  // Strip time for strict day comparison
  now.setHours(0, 0, 0, 0);
  lastActive.setHours(0, 0, 0, 0);

  const diffTime = Math.abs(now - lastActive);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) {
    // Logged in consecutive day
    user.currentStreak += 1;
    if (user.currentStreak > user.longestStreak) {
      user.longestStreak = user.currentStreak;
    }
  } else if (diffDays > 1) {
    // Streak broken
    user.currentStreak = 1; 
  }
  
  // If diffDays === 0, same day, do nothing to streak

  user.lastActive = new Date();
  return user;
};

// @desc    Update Daily Streak
// @route   POST /api/gamification/streak
// @access  Private
const updateStreak = async (req, res) => {
  try {
    let user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user = await calculateStreak(user);
    await user.save();

    res.json({ 
      success: true, 
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Award points manually (Admin/Expert use or internal middleware)
// @route   POST /api/gamification/award
// @access  Private (Admin)
const awardPoints = async (req, res) => {
  try {
    const { userId, xpAmount, reason } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.xpPoints += Number(xpAmount);
    user.coins += Math.floor(Number(xpAmount) / 10); // arbitrary coin economy logic
    await user.save();

    // Trigger Notification creation here ideally...

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  updateStreak,
  awardPoints
};