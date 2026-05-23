const Badge = require('../models/Badge');
const Notification = require('../models/Notification');
const Session = require('../models/Session');
const User = require('../models/User');

const toId = (value) => String(value?._id || value);
const isOwnerOrAdmin = (session, user) => user.role === 'Admin' || toId(session.expert) === toId(user._id);

const createSession = async (req, res) => {
  try {
    const {
      title,
      description,
      scheduledAt,
      durationMinutes,
      meetingLink,
      tags,
      pointsReward,
      sessionType,
      domain,
      technologies,
      reminderMinutesBefore,
      maxAttendees,
      qaEnabled,
      chatEnabled,
    } = req.body;

    const session = new Session({
      title,
      description,
      expert: req.user._id,
      scheduledAt,
      durationMinutes,
      meetingLink,
      tags,
      pointsReward,
      sessionType,
      domain,
      technologies,
      reminderMinutesBefore,
      maxAttendees,
      qaEnabled,
      chatEnabled,
    });

    const createdSession = await session.save();
    res.status(201).json({ success: true, data: createdSession });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({})
      .sort({ scheduledAt: 1 })
      .populate('expert', 'firstName lastName profilePicture designation');

    res.json({ success: true, count: sessions.length, data: sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate(
      'expert',
      'firstName lastName profilePicture designation role',
    );

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    return res.json({ success: true, data: session });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const registerForSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    if (['Completed', 'Cancelled'].includes(session.status)) {
      return res.status(400).json({ success: false, message: `Cannot register for a ${session.status} session` });
    }

    if ((session.attendees || []).some((attendeeId) => toId(attendeeId) === toId(req.user._id))) {
      return res.status(400).json({ success: false, message: 'Already registered for this session' });
    }

    if ((session.maxAttendees || 0) > 0 && (session.attendees || []).length >= session.maxAttendees) {
      return res.status(400).json({ success: false, message: 'Session capacity reached' });
    }

    if (!Array.isArray(session.attendees)) {
      session.attendees = [];
    }
    if (!Array.isArray(session.attendance)) {
      session.attendance = [];
    }
    session.attendees.push(req.user._id);
    session.attendance.push({
      user: req.user._id,
      status: 'Registered',
      markedAt: new Date(),
    });
    await session.save();

    await Notification.create({
      user: req.user._id,
      title: 'Session Registration Confirmed',
      message: `You are registered for "${session.title}". Reminder notifications will be sent before it starts.`,
      type: 'SESSION',
      link: `/sessions/${session._id}`,
    });

    return res.json({ success: true, message: 'Successfully registered for session' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const markSessionLive = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    if (!isOwnerOrAdmin(session, req.user)) {
      return res.status(403).json({ success: false, message: 'Not authorized to control this session' });
    }

    session.status = 'Live';
    await session.save();

    if ((session.attendees || []).length > 0) {
      await Notification.insertMany(
        session.attendees.map((attendeeId) => ({
          user: attendeeId,
          title: 'Session is Live',
          message: `"${session.title}" has started. Join now and participate in live Q&A.`,
          type: 'SESSION',
          link: `/sessions/${session._id}`,
        })),
      );
    }

    return res.json({ success: true, data: session });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const markAttendance = async (req, res) => {
  try {
    const { attendeeId, status } = req.body;
    if (!attendeeId) {
      return res.status(400).json({ success: false, message: 'attendeeId is required' });
    }
    const normalizedStatus = status === 'Absent' ? 'Absent' : 'Present';
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    if (!isOwnerOrAdmin(session, req.user)) {
      return res.status(403).json({ success: false, message: 'Not authorized to mark attendance' });
    }

    if (!(session.attendees || []).some((id) => toId(id) === toId(attendeeId))) {
      return res.status(400).json({ success: false, message: 'User is not registered for this session' });
    }

    if (!Array.isArray(session.attendance)) {
      session.attendance = [];
    }
    const attendanceIndex = (session.attendance || []).findIndex((entry) => toId(entry.user) === toId(attendeeId));

    if (attendanceIndex === -1) {
      session.attendance.push({
        user: attendeeId,
        status: normalizedStatus,
        markedAt: new Date(),
      });
    } else {
      session.attendance[attendanceIndex].status = normalizedStatus;
      session.attendance[attendanceIndex].markedAt = new Date();
    }

    await session.save();
    return res.json({ success: true, data: session });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const sendSessionReminders = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    if (!isOwnerOrAdmin(session, req.user)) {
      return res.status(403).json({ success: false, message: 'Not authorized to send reminders' });
    }

    if ((session.attendees || []).length === 0) {
      return res.status(400).json({ success: false, message: 'No registered attendees to notify' });
    }

    await Notification.insertMany(
      session.attendees.map((attendeeId) => ({
        user: attendeeId,
        title: 'Session Reminder',
        message: `Reminder: "${session.title}" starts at ${new Date(session.scheduledAt).toLocaleString()}.`,
        type: 'SESSION',
        link: `/sessions/${session._id}`,
      })),
    );

    if (!Array.isArray(session.remindersSentAt)) {
      session.remindersSentAt = [];
    }
    session.remindersSentAt.push(new Date());
    await session.save();

    return res.json({ success: true, message: 'Reminder notifications sent' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const completeSession = async (req, res) => {
  try {
    const { recordingUrl } = req.body;
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    if (!isOwnerOrAdmin(session, req.user)) {
      return res.status(403).json({ success: false, message: 'Not authorized to complete this session' });
    }

    if (recordingUrl) {
      session.recordingUrl = recordingUrl;
    }
    session.status = 'Completed';

    if (!session.rewardsDistributed) {
      const presentAttendees = (session.attendance || [])
        .filter((entry) => entry.status === 'Present')
        .map((entry) => toId(entry.user));
      const fallbackAttendees = (session.attendees || []).map((id) => toId(id));
      const rewardedAttendees = presentAttendees.length > 0 ? presentAttendees : fallbackAttendees;

      const attendeeReward = Number(session.pointsReward || 0);
      const attendeeCoins = Math.floor(attendeeReward / 10);
      const expertReward = attendeeReward * 2 + 20;

      const attendees = await User.find({ _id: { $in: rewardedAttendees } });
      for (const attendee of attendees) {
        attendee.xpPoints += attendeeReward;
        attendee.coins += attendeeCoins;
        attendee.sessionStats.attended += 1;
        await attendee.save();
      }

      const expert = await User.findById(session.expert).populate('badges.badge');
      if (expert) {
        expert.xpPoints += expertReward;
        expert.coins += Math.floor(expertReward / 10);
        expert.sessionStats.hosted += 1;

        let mentorBadge = await Badge.findOne({ name: 'Automation Mentor' });
        if (!mentorBadge) {
          mentorBadge = await Badge.create({
            name: 'Automation Mentor',
            description: 'Awarded for leading expert sessions in AI and automation domains.',
            icon: 'BOT',
            criteriaType: 'SESSIONS_ATTENDED',
            criteriaTarget: 3,
          });
        }

        const alreadyHasMentorBadge = (expert.badges || []).some(
          (entry) => toId(entry.badge?._id || entry.badge) === toId(mentorBadge._id),
        );

        if (expert.sessionStats.hosted >= 3 && !alreadyHasMentorBadge) {
          expert.badges.push({ badge: mentorBadge._id, earnedAt: new Date() });
        }

        await expert.save();

        await Notification.create({
          user: expert._id,
          title: 'Expert Session Rewards Added',
          message: `You earned ${expertReward} XP for completing "${session.title}".`,
          type: 'GAMIFICATION',
          link: '/profile',
        });
      }

      if (rewardedAttendees.length > 0) {
        await Notification.insertMany(
          rewardedAttendees.map((attendeeId) => ({
            user: attendeeId,
            title: 'Session Completed',
            message: `You earned ${attendeeReward} XP for attending "${session.title}".`,
            type: 'SESSION',
            link: `/sessions/${session._id}`,
          })),
        );
      }

      session.rewardsDistributed = true;
    }

    await session.save();
    return res.json({ success: true, data: session });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const submitSessionFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const numericRating = Number(rating);
    const session = await Session.findById(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    if (session.status !== 'Completed') {
      return res.status(400).json({ success: false, message: 'Feedback can only be submitted after completion' });
    }

    if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
    }

    if (!(session.attendees || []).some((attendeeId) => toId(attendeeId) === toId(req.user._id))) {
      return res.status(403).json({ success: false, message: 'Only registered attendees can submit feedback' });
    }

    const existingFeedbackIndex = (session.feedbacks || []).findIndex((entry) => toId(entry.user) === toId(req.user._id));
    if (existingFeedbackIndex >= 0) {
      return res.status(400).json({ success: false, message: 'Feedback already submitted for this session' });
    }

    if (!Array.isArray(session.feedbacks)) {
      session.feedbacks = [];
    }
    session.feedbacks.push({
      user: req.user._id,
      rating: numericRating,
      comment: comment?.trim() || '',
      createdAt: new Date(),
    });

    const totalRatings = session.feedbacks.reduce((sum, entry) => sum + Number(entry.rating || 0), 0);
    session.averageRating = Number((totalRatings / Math.max(session.feedbacks.length, 1)).toFixed(1));
    await session.save();

    await Notification.create({
      user: session.expert,
      title: 'New Session Feedback',
      message: `A participant rated "${session.title}" with ${numericRating}/5.`,
      type: 'SESSION',
      link: `/sessions/${session._id}`,
    });

    return res.json({ success: true, data: session });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createSession,
  getSessions,
  getSessionById,
  registerForSession,
  markSessionLive,
  markAttendance,
  sendSessionReminders,
  completeSession,
  submitSessionFeedback,
};
