require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // TODO: Update to frontend origin in production
    methods: ['GET', 'POST']
  }
});

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tecnoprism_lms';

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Socket.io for live sessions/chat
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('join_session', (sessionId) => {
    socket.join(sessionId);
    console.log(`User ${socket.id} joined session ${sessionId}`);
  });

  socket.on('send_message', (data) => {
    // data should contain { sessionId, text, user: { firstName, lastName } }
    io.to(data.sessionId).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Basic Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'API is running', version: '1.0.0' });
});

// Auth Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Course Routes
const courseRoutes = require('./routes/courseRoutes');
app.use('/api/courses', courseRoutes);

// Session Routes
const sessionRoutes = require('./routes/sessionRoutes');
app.use('/api/sessions', sessionRoutes);

// Blog Routes
const blogRoutes = require('./routes/blogRoutes');
app.use('/api/blogs', blogRoutes);

// Gamification & Leaderboard Routes
const gamificationRoutes = require('./routes/gamificationRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
app.use('/api/gamification', gamificationRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/notifications', notificationRoutes);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
