const Session = require('../models/Session');

// @desc    Create an expert session
// @route   POST /api/sessions
// @access  Private (Admin, Expert)
const createSession = async (req, res) => {
  try {
    const { title, description, scheduledAt, durationMinutes, meetingLink, tags, pointsReward } = req.body;

    const session = new Session({
      title,
      description,
      expert: req.user._id,
      scheduledAt,
      durationMinutes,
      meetingLink,
      tags,
      pointsReward
    });

    const createdSession = await session.save();
    res.status(201).json({ success: true, data: createdSession });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all sessions
// @route   GET /api/sessions
// @access  Private
const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find().populate('expert', 'firstName lastName profilePicture designation');
    res.json({ success: true, count: sessions.length, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Register to attend a session
// @route   POST /api/sessions/:id/register
// @access  Private
const registerForSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    if (session.attendees.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'Already registered for this session' });
    }

    session.attendees.push(req.user._id);
    await session.save();

    res.json({ success: true, message: 'Successfully registered for session' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createSession,
  getSessions,
  registerForSession
};
