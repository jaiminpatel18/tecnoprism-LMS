import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  FiAward,
  FiBookOpen,
  FiCalendar,
  FiChevronRight,
  FiClock,
  FiStar,
  FiZap,
} from 'react-icons/fi';
import Layout from '../components/Layout';
import { ProgressBar, SectionHeading, SurfaceCard } from '../components/UiPrimitives';

const stats = [
  { label: 'XP Points', value: '2,480', icon: FiStar, tint: 'from-indigo-500 to-purple-600' },
  { label: 'Learning Streak', value: '14 days', icon: FiZap, tint: 'from-orange-500 to-amber-500' },
  { label: 'Courses Completed', value: '11', icon: FiBookOpen, tint: 'from-emerald-500 to-teal-500' },
  { label: 'Leaderboard Rank', value: '#4', icon: FiAward, tint: 'from-blue-500 to-cyan-500' },
];

const activity = [
  { title: 'Completed: Advanced React Patterns', time: '2 hours ago', xp: '+180 XP' },
  { title: 'Joined Live Session: AI Architecture Review', time: 'Yesterday', xp: '+90 XP' },
  { title: 'Published knowledge blog: API performance tuning', time: '2 days ago', xp: '+120 XP' },
];

function Dashboard() {
  const { user } = useSelector((state) => state.auth);

  const weeklyXp = useMemo(() => [120, 180, 150, 260, 220, 200, 240], []);
  const weeklyLabels = useMemo(() => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], []);

  return (
    <Layout title="Learning Dashboard" subtitle="Track growth, maintain streaks, and keep your learning momentum high.">
      <div className="space-y-6">
        <SurfaceCard className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 p-7 text-white">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
          <p className="text-xs uppercase tracking-[0.22em] text-indigo-100">Welcome back</p>
          <h2 className="mt-2 text-3xl font-semibold">Hi {user?.firstName || 'Learner'}, your streak is on fire.</h2>
          <p className="mt-2 max-w-2xl text-indigo-100">
            You are 70 XP away from unlocking the next mastery badge. Keep pushing with one focused session today.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              to="/courses"
              className="focus-ring inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:scale-[1.02]"
            >
              Continue Learning <FiChevronRight />
            </Link>
            <div className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm">
              <FiZap className="streak-flame text-orange-300" /> Daily streak multiplier x1.5
            </div>
          </div>
        </SurfaceCard>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => (
            <SurfaceCard
              key={stat.label}
              delay={index * 0.04}
              className="rounded-2xl p-5 hover:-translate-y-0.5 hover:shadow-lg transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">{stat.value}</p>
                </div>
                <div className={`rounded-xl bg-gradient-to-br p-3 text-white ${stat.tint}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </SurfaceCard>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[2fr_1fr]">
          <SurfaceCard className="rounded-2xl p-5">
            <SectionHeading title="Weekly Learning Activity" subtitle="Your XP performance over the last 7 days." />
            <div className="mt-2 grid grid-cols-7 items-end gap-3 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/60">
              {weeklyXp.map((value, index) => (
                <div key={weeklyLabels[index]} className="flex flex-col items-center gap-2">
                  <div className="relative flex h-44 w-full items-end">
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-indigo-500 to-purple-500"
                      style={{ height: `${Math.max((value / 280) * 100, 8)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{weeklyLabels[index]}</p>
                </div>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard className="rounded-2xl p-5">
            <SectionHeading title="Path Completion" subtitle="Progress split by learning status." />
            <div className="space-y-4">
              {[
                { label: 'Completed', value: 64, color: 'from-indigo-500 to-indigo-600' },
                { label: 'In Progress', value: 24, color: 'from-emerald-500 to-emerald-600' },
                { label: 'Upcoming', value: 12, color: 'from-amber-500 to-amber-600' },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                    <span>{item.label}</span>
                    <span>{item.value}%</span>
                  </div>
                  <ProgressBar value={item.value} color={item.color} />
                </div>
              ))}
            </div>
          </SurfaceCard>
        </section>

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <SurfaceCard className="rounded-2xl p-5">
            <SectionHeading title="Activity Timeline" />
            <div className="space-y-4">
              {activity.map((item) => (
                <div key={item.title} className="rounded-xl border border-indigo-100/70 p-3 dark:border-slate-700">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{item.title}</p>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>{item.time}</span>
                    <span className="rounded-full bg-emerald-100 px-2 py-1 font-medium text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                      {item.xp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard className="rounded-2xl p-5">
            <SectionHeading title="Upcoming Sessions" action={<Link to="/sessions" className="text-sm text-indigo-500">View all</Link>} />
            <div className="space-y-3">
              {[
                { title: 'Scaling Microservices', when: 'Today • 6:00 PM' },
                { title: 'Prompt Engineering Masterclass', when: 'Tomorrow • 5:30 PM' },
                { title: 'Cloud Security AMA', when: 'Fri • 4:00 PM' },
              ].map((session) => (
                <div key={session.title} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{session.title}</p>
                  <p className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <FiCalendar /> {session.when}
                  </p>
                </div>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard className="rounded-2xl p-5">
            <SectionHeading title="Leaderboard Preview" action={<Link to="/leaderboard" className="text-sm text-indigo-500">See full</Link>} />
            <div className="space-y-3">
              {[
                { name: 'Ava Shah', xp: '3,440 XP' },
                { name: 'Rohan Mehta', xp: '3,190 XP' },
                { name: `${user?.firstName || 'You'} ${user?.lastName || ''}`.trim(), xp: '2,480 XP' },
              ].map((person, idx) => (
                <motion.div
                  key={person.name}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between rounded-xl border border-indigo-100/70 px-3 py-2 dark:border-slate-700"
                >
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    #{idx + 1} {person.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{person.xp}</p>
                </motion.div>
              ))}
            </div>
          </SurfaceCard>
        </section>

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <SurfaceCard className="rounded-2xl p-5">
            <SectionHeading title="Recommended Courses" action={<Link to="/courses" className="text-sm text-indigo-500">Explore</Link>} />
            <div className="space-y-3">
              {[
                { name: 'GenAI for Product Teams', progress: 72 },
                { name: 'Kubernetes in Practice', progress: 34 },
                { name: 'System Design for Architects', progress: 56 },
              ].map((course) => (
                <div key={course.name}>
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-700 dark:text-slate-200">
                    <span>{course.name}</span>
                    <span>{course.progress}%</span>
                  </div>
                  <ProgressBar value={course.progress} />
                </div>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard className="rounded-2xl p-5">
            <SectionHeading title="Recent Blogs" action={<Link to="/blogs" className="text-sm text-indigo-500">Read all</Link>} />
            <div className="space-y-3">
              {[
                { title: 'How our engineering team reduced deployment time by 42%', meta: '6 min read' },
                { title: 'Frontend architecture patterns that scale in enterprise teams', meta: '8 min read' },
                { title: 'Building stronger async collaboration habits', meta: '4 min read' },
              ].map((blog) => (
                <div key={blog.title} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{blog.title}</p>
                  <p className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <FiClock /> {blog.meta}
                  </p>
                </div>
              ))}
            </div>
          </SurfaceCard>
        </section>
      </div>
    </Layout>
  );
}

export default Dashboard;
