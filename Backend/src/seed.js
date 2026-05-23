const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Course = require('./models/Course');
const Session = require('./models/Session');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tecnoprism_lms';

const buildModules = (moduleTitle, lessons) => [
  {
    title: moduleTitle,
    description: `${moduleTitle} practical workflow`,
    lessons: lessons.map((lessonTitle, idx) => ({
      title: lessonTitle,
      description: `${lessonTitle} deep dive`,
      durationMinutes: 12 + idx * 4,
    })),
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await Promise.all([User.deleteMany({}), Course.deleteMany({}), Session.deleteMany({})]);
    console.log('Cleared existing users, courses, and sessions.');

    const [adminUser, expertUser, emp1, emp2, emp3] = await User.create([
      {
        firstName: 'Admin',
        lastName: 'Operator',
        email: 'admin@tecnoprism.com',
        password: 'password123',
        role: 'Admin',
        designation: 'LMS Administrator',
        department: 'Operations',
        xpPoints: 5200,
        currentStreak: 10,
        sessionStats: { attended: 4, hosted: 0 },
        skillFocus: ['AI Automation', 'Workflow Orchestration'],
      },
      {
        firstName: 'Aarav',
        lastName: 'Shah',
        email: 'expert@tecnoprism.com',
        password: 'password123',
        role: 'Expert',
        designation: 'Principal Automation Architect',
        department: 'Engineering',
        xpPoints: 4100,
        currentStreak: 8,
        sessionStats: { attended: 6, hosted: 2 },
        skillFocus: ['RPA', 'Agentic AI', 'Enterprise Automation'],
      },
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@tecnoprism.com',
        password: 'password123',
        role: 'Employee',
        designation: 'RPA Developer',
        department: 'Engineering',
        xpPoints: 1700,
        currentStreak: 12,
        sessionStats: { attended: 3, hosted: 0 },
        skillFocus: ['UiPath', 'Power Automate'],
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@tecnoprism.com',
        password: 'password123',
        role: 'Employee',
        designation: 'AI Automation Engineer',
        department: 'Data',
        xpPoints: 2550,
        currentStreak: 5,
        sessionStats: { attended: 4, hosted: 0 },
        skillFocus: ['LangChain', 'OpenAI APIs'],
      },
      {
        firstName: 'Meera',
        lastName: 'Patel',
        email: 'meera.patel@tecnoprism.com',
        password: 'password123',
        role: 'Employee',
        designation: 'Process Transformation Analyst',
        department: 'Product',
        xpPoints: 1380,
        currentStreak: 4,
        sessionStats: { attended: 2, hosted: 0 },
        skillFocus: ['Process Mining', 'Digital Transformation'],
      },
    ]);

    const courses = await Course.insertMany([
      {
        title: 'Power Automate Enterprise Workflows',
        description: 'Design robust enterprise automations with approvals, connectors, and resilient error handling.',
        category: 'Automation',
        learningDomain: 'RPA',
        technologies: ['Microsoft Power Automate', 'OCR Automation'],
        careerPaths: ['RPA Developer Path', 'AI Workflow Engineer'],
        estimatedHours: 6,
        level: 'Intermediate',
        instructor: expertUser._id,
        pointsReward: 280,
        isPublished: true,
        modules: buildModules('Workflow Foundations', [
          'Flow design standards',
          'Connector orchestration',
          'Exception management',
        ]),
      },
      {
        title: 'Agentic AI with LangChain',
        description: 'Build autonomous agents that plan, invoke tools, and evaluate outcomes for enterprise operations.',
        category: 'AI',
        learningDomain: 'Agentic AI',
        technologies: ['LangChain', 'OpenAI APIs', 'AI Agents'],
        careerPaths: ['Agentic AI Specialist', 'AI Automation Engineer'],
        estimatedHours: 7,
        level: 'Advanced',
        instructor: expertUser._id,
        pointsReward: 420,
        isPublished: true,
        modules: buildModules('Agent Runtime Design', [
          'Tool-calling agents',
          'Memory and context windows',
          'Guardrails and observability',
        ]),
      },
      {
        title: 'Intelligent Document Processing',
        description: 'Automate document-heavy workflows using OCR, extraction pipelines, and confidence-based routing.',
        category: 'Automation',
        learningDomain: 'Intelligent Workflows',
        technologies: ['OCR Automation', 'Intelligent Document Processing', 'Python Automation'],
        careerPaths: ['Process Optimization Expert', 'Automation Architect'],
        estimatedHours: 5,
        level: 'Intermediate',
        instructor: expertUser._id,
        pointsReward: 260,
        isPublished: true,
        modules: buildModules('Document Intelligence', [
          'OCR quality tuning',
          'Extraction + validation',
          'Human-in-the-loop design',
        ]),
      },
      {
        title: 'Enterprise Workflow Orchestration',
        description: 'Coordinate multi-system, event-driven workflows for resilient autonomous operations.',
        category: 'Enterprise',
        learningDomain: 'Workflow Orchestration',
        technologies: ['AI Workflows', 'Automation Anywhere', 'Blue Prism'],
        careerPaths: ['Automation Architect', 'AI Workflow Engineer'],
        estimatedHours: 8,
        level: 'Advanced',
        instructor: expertUser._id,
        pointsReward: 460,
        isPublished: true,
        modules: buildModules('Orchestration at Scale', [
          'Cross-system orchestration',
          'Fallback and retry patterns',
          'Operational telemetry',
        ]),
      },
      {
        title: 'Digital Transformation Playbook',
        description: 'Map business processes, identify automation opportunities, and execute AI-first transformation programs.',
        category: 'Strategy',
        learningDomain: 'Digital Transformation',
        technologies: ['Process Mining', 'Enterprise AI Systems'],
        careerPaths: ['Process Optimization Expert', 'AI Automation Engineer'],
        estimatedHours: 4,
        level: 'Beginner',
        instructor: adminUser._id,
        pointsReward: 200,
        isPublished: true,
        modules: buildModules('Transformation Foundations', [
          'Process discovery',
          'Automation opportunity scoring',
          'Change management for AI adoption',
        ]),
      },
    ]);

    await Session.insertMany([
      {
        title: 'UiPath + Agentic AI Co-Pilot Lab',
        description: 'Hands-on lab on blending UiPath bots with agentic AI orchestration for unattended operations.',
        expert: expertUser._id,
        scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        durationMinutes: 75,
        sessionType: 'Hands-on Lab',
        domain: 'Agentic AI',
        technologies: ['UiPath', 'AI Agents', 'LangChain'],
        meetingLink: 'https://meet.google.com/tecnoprism-agent-lab',
        reminderMinutesBefore: [1440, 60, 15],
        maxAttendees: 80,
        attendees: [emp1._id, emp2._id, emp3._id],
        attendance: [
          { user: emp1._id, status: 'Registered' },
          { user: emp2._id, status: 'Registered' },
          { user: emp3._id, status: 'Registered' },
        ],
        tags: ['Agentic AI', 'RPA', 'Automation'],
        status: 'Upcoming',
        pointsReward: 80,
      },
      {
        title: 'Prompt Engineering for Enterprise Automation',
        description: 'Expert AMA on prompt patterns for workflow reliability, extraction quality, and AI guardrails.',
        expert: expertUser._id,
        scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 48),
        durationMinutes: 60,
        sessionType: 'AMA',
        domain: 'Generative AI',
        technologies: ['Prompt Engineering', 'OpenAI APIs'],
        meetingLink: 'https://meet.google.com/tecnoprism-prompt-ama',
        reminderMinutesBefore: [1440, 60],
        maxAttendees: 120,
        attendees: [emp2._id],
        attendance: [{ user: emp2._id, status: 'Registered' }],
        tags: ['Prompt Engineering', 'GenAI'],
        status: 'Upcoming',
        pointsReward: 70,
      },
    ]);

    console.log(`Seeded ${courses.length} courses and 2 expert sessions for Tecnoprism LMS.`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
