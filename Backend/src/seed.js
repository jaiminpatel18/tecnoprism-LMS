const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Course = require('./models/Course');

dotenv.config(); // Ensure we can read MONGO_URI

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tecnoprism_lms';

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Wipe existing data
    await User.deleteMany({});
    await Course.deleteMany({});
    console.log('Cleared existing data.');

    // Create Admin User
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@tecnoprism.com',
      password: 'password123',
      role: 'Admin',
      designation: 'LMS Administrator',
      xpPoints: 5000,
      currentStreak: 10,
    });

    // Create Expert User
    const expertUser = await User.create({
      firstName: 'Expert',
      lastName: 'Mentor',
      email: 'expert@tecnoprism.com',
      password: 'password123',
      role: 'Expert',
      designation: 'Senior Engineer',
      xpPoints: 3500,
      currentStreak: 5,
    });

    // Create some Employees with Gamification stats for Leaderboard
    const emp1 = await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@tecnoprism.com',
      password: 'password123',
      role: 'Employee',
      designation: 'Frontend Developer',
      xpPoints: 1200,
      currentStreak: 12,
    });

    const emp2 = await User.create({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@tecnoprism.com',
      password: 'password123',
      role: 'Employee',
      designation: 'Backend Developer',
      xpPoints: 2400,
      currentStreak: 4,
    });

    // Create Courses
    const course1 = await Course.create({
      title: 'Advanced React Patterns',
      description: 'Master React by learning advanced design patterns including HOCs, Render Props, and custom hooks.',
      category: 'Frontend',
      level: 'Advanced',
      instructor: expertUser._id,
      pointsReward: 300,
      isPublished: true,
      modules: [
        {
          title: 'Introduction to Patterns',
          lessons: [{ title: 'Why Patterns Matter', durationMinutes: 10 }]
        }
      ]
    });

    const course2 = await Course.create({
      title: 'Node.js Microservices',
      description: 'Learn how to build scalable microservices architecture using Node.js and Docker.',
      category: 'Backend',
      level: 'Intermediate',
      instructor: expertUser._id,
      pointsReward: 500,
      isPublished: true,
      modules: [
        {
          title: 'Docker Basics',
          lessons: [{ title: 'Containerization 101', durationMinutes: 15 }]
        }
      ]
    });

    console.log('Database successfully seeded with Users and Courses!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
