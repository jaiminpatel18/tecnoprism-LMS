import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  FiAward,
  FiChevronRight,
  FiClock,
  FiLayers,
  FiStar,
  FiTrendingUp,
  FiZap,
} from 'react-icons/fi';
import Layout from '../components/Layout';
import { EmptyState, ProgressBar, SectionHeading, SurfaceCard } from '../components/UiPrimitives';
import DashboardSkeleton from '../components/skeletons/DashboardSkeleton';
import { API_URL, authConfig } from '../utils/api';

function Dashboard() {
  const { token, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/gamification/dashboard`, authConfig(token));
        setSummary(data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [token]);

  const stats = useMemo(() => {
    if (!summary) {
      return [];
    }
    return [
      {
        label: 'XP Points',
        value: `${summary.user?.xpPoints || 0}`,
        icon: FiStar,
        tint: 'from-indigo-500 to-purple-600',
      },
      {
        label: 'Coins',
        value: `${summary.user?.coins || 0}`,
        icon: FiAward,
        tint: 'from-amber-500 to-orange-500',
      },
      {
        label: 'Current Streak',
        value: `${summary.user?.currentStreak || 0} days`,
        icon: FiZap,
        tint: 'from-orange-500 to-amber-500',
      },
      {
        label: 'Leaderboard Rank',
        value: `#${summary.stats?.leaderboardRank || '-'}`,
        icon: FiTrendingUp,
        tint: 'from-blue-500 to-cyan-500',
      },
    ];
  }, [summary]);

  const breakdownPercentages = useMemo(() => {
    const breakdown = summary?.pathBreakdown;
    if (!breakdown) {
      return [
        { label: 'Completed', value: 0, color: 'from-indigo-500 to-indigo-600' },
        { label: 'In Progress', value: 0, color: 'from-emerald-500 to-emerald-600' },
        { label: 'Upcoming', value: 0, color: 'from-amber-500 to-amber-600' },
      ];
    }

    const total = Math.max((breakdown.completed || 0) + (breakdown.inProgress || 0) + (breakdown.upcoming || 0), 1);
    return [
      {
        label: 'Completed',
        value: Math.round(((breakdown.completed || 0) / total) * 100),
        color: 'from-indigo-500 to-indigo-600',
      },
      {
        label: 'In Progress',
        value: Math.round(((breakdown.inProgress || 0) / total) * 100),
        color: 'from-emerald-500 to-emerald-600',
      },
      {
        label: 'Upcoming',
        value: Math.round(((breakdown.upcoming || 0) / total) * 100),
        color: 'from-amber-500 to-amber-600',
      },
    ];
  }, [summary?.pathBreakdown]);

  if (loading) {
    return (
      <Layout title="Learning Dashboard" subtitle="Loading personalized workspace...">
        <DashboardSkeleton />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Learning Dashboard" subtitle="Could not load dashboard data.">
        <EmptyState icon={FiLayers} title="Dashboard unavailable" description={error} />
      </Layout>
    );
  }

  const resumeCourses = summary?.enrolledCourses?.slice(0, 3) || [];
  const recommendedCourses = summary?.recommendedCourses || [];
  const leaderboardPreview = summary?.leaderboardPreview || [];
  const activity = summary?.recentNotifications || [];

  return (
    <Layout title="Learning Dashboard" subtitle="AI-first learning cockpit for automation growth, collaboration, and innovation.">
      <div className="space-y-6">
        <SurfaceCard className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 p-7 text-white">
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
          <p className="text-xs uppercase tracking-[0.22em] text-indigo-100">Welcome back</p>
          <h2 className="mt-2 text-3xl font-semibold">
            Hi {summary?.user?.firstName || user?.firstName || 'Learner'}, your streak is alive.
          </h2>
          <p className="mt-2 max-w-2xl text-indigo-100">
            You currently have {summary?.user?.xpPoints || 0} XP and {summary?.stats?.badges || 0} badges unlocked.
          </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/courses')}
                className="focus-ring inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-indigo-700 transition hover:scale-[1.02]"
              >
                Continue Learning <FiChevronRight />
              </button>
              <button
                type="button"
                onClick={() => navigate('/career-paths')}
                className="focus-ring inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm"
              >
                Open Career Paths <FiChevronRight />
              </button>
              <div className="inline-flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2 text-sm">
                <FiZap className="streak-flame text-orange-300" /> Daily streak: {summary?.user?.currentStreak || 0} days
              </div>
          </div>
        </SurfaceCard>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, index) => (
            <SurfaceCard key={stat.label} delay={index * 0.04} className="rounded-2xl p-5">
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
            <SectionHeading title="Resume Learning" subtitle="Courses you started with real completion progress." />
            {resumeCourses.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">No enrolled courses yet. Start your first one.</p>
            ) : (
              <div className="space-y-4">
                {resumeCourses.map((course) => (
                  <div key={course.courseId} className="rounded-xl border border-indigo-100/70 p-4 dark:border-slate-700">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{course.title}</p>
                      <span className="text-xs text-slate-500 dark:text-slate-400">{course.progress || 0}%</span>
                    </div>
                    <ProgressBar value={course.progress || 0} color="from-indigo-500 to-purple-600" />
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {course.completedLessons?.length || 0}/{course.totalLessons || 0} lessons completed
                      </p>
                      <button
                        type="button"
                        onClick={() => navigate(`/courses/${course.courseId}`)}
                        className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:bg-slate-800 dark:text-indigo-300"
                      >
                        Resume
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </SurfaceCard>

          <SurfaceCard className="rounded-2xl p-5">
            <SectionHeading title="Path Completion" subtitle="Computed from your actual enrollment." />
            <div className="space-y-4">
              {breakdownPercentages.map((item) => (
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
            <div className="space-y-3">
              {activity.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">No recent activity yet.</p>
              ) : (
                activity.map((item) => (
                  <div key={item._id} className="rounded-xl border border-indigo-100/70 p-3 dark:border-slate-700">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{item.title}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.message}</p>
                  </div>
                ))
              )}
            </div>
          </SurfaceCard>

          <SurfaceCard className="rounded-2xl p-5">
            <SectionHeading title="Leaderboard Preview" action={<Link to="/leaderboard" className="text-sm text-indigo-500">See full</Link>} />
            <div className="space-y-3">
              {leaderboardPreview.map((person, idx) => (
                <motion.div
                  key={person._id || `${person.firstName}-${idx}`}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between rounded-xl border border-indigo-100/70 px-3 py-2 dark:border-slate-700"
                >
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    #{idx + 1} {person.firstName} {person.lastName}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{person.xpPoints} XP</p>
                </motion.div>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard className="rounded-2xl p-5">
            <SectionHeading title="Recommended Courses" action={<Link to="/courses" className="text-sm text-indigo-500">Explore</Link>} />
            <div className="space-y-3">
              {recommendedCourses.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">No recommendations right now.</p>
              ) : (
                recommendedCourses.map((course) => (
                  <div key={course._id} className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{course.title}</p>
                    <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                      <FiClock /> {course.level} • {course.pointsReward || 0} XP
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate(`/courses/${course._id}`)}
                      className="mt-2 rounded-lg bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-slate-800 dark:text-indigo-300"
                    >
                      Open
                    </button>
                  </div>
                ))
              )}
            </div>
          </SurfaceCard>
        </section>
      </div>
    </Layout>
  );
}

export default Dashboard;
