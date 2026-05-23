import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FiAward, FiBarChart2, FiBookOpen, FiCheckCircle, FiStar, FiZap } from 'react-icons/fi';
import Layout from '../components/Layout';
import { EmptyState, ProgressBar, SectionHeading, SkeletonGrid, SurfaceCard } from '../components/UiPrimitives';
import { API_URL, authConfig } from '../utils/api';

function Profile() {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/gamification/profile`, authConfig(token));
        setProfileData(data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const levelInfo = useMemo(() => {
    const xp = profileData?.profile?.xpPoints || 0;
    const level = Math.max(Math.floor(xp / 500) + 1, 1);
    const currentFloor = (level - 1) * 500;
    const currentCeil = level * 500;
    const pct = Math.round(((xp - currentFloor) / Math.max(currentCeil - currentFloor, 1)) * 100);
    return { level, pct, nextTarget: currentCeil };
  }, [profileData?.profile?.xpPoints]);

  if (loading) {
    return (
      <Layout title="Employee Profile" subtitle="Loading your learning identity...">
        <SkeletonGrid />
      </Layout>
    );
  }

  if (error || !profileData) {
    return (
      <Layout title="Employee Profile" subtitle="Could not load profile.">
        <EmptyState icon={FiBookOpen} title="Profile unavailable" description={error || 'No profile data found.'} />
      </Layout>
    );
  }

  const { profile, badges, activity, enrolledCourses, certificates, stats } = profileData;

  return (
    <Layout title="Employee Profile" subtitle="Personal learning identity, achievements, and progress history.">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.1fr_1.9fr]">
        <SurfaceCard className="rounded-2xl p-5">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-3xl font-semibold text-white">
              {profile?.firstName?.charAt(0)}
              {profile?.lastName?.charAt(0)}
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {profile?.firstName} {profile?.lastName}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {profile?.role || 'Employee'} {profile?.designation ? `• ${profile.designation}` : ''}
            </p>
            <div className="mt-4 rounded-xl bg-indigo-50 px-3 py-2 text-sm text-indigo-700 dark:bg-slate-800 dark:text-indigo-300">
              Level {levelInfo.level} • {profile?.xpPoints || 0} XP • {profile?.coins || 0} Coins
            </div>
          </div>
        </SurfaceCard>

        <div className="space-y-5">
          <SurfaceCard className="rounded-2xl p-5">
            <SectionHeading title="Learning Stats" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
              {[
                { label: 'Completed Courses', value: stats?.completedCourses || 0, icon: FiBookOpen },
                { label: 'Current Streak', value: `${profile?.currentStreak || 0} days`, icon: FiZap },
                { label: 'Certificates', value: stats?.certificates || 0, icon: FiAward },
                { label: 'Badges', value: stats?.badges || 0, icon: FiStar },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-indigo-100/70 p-3 dark:border-slate-700">
                  <stat.icon className="text-indigo-500" />
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{stat.value}</p>
                </div>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard className="rounded-2xl p-5">
            <SectionHeading title="Current Enrollments" subtitle="Resume active courses with real progress." />
            <div className="space-y-3">
              {enrolledCourses.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">No active enrollments yet.</p>
              ) : (
                enrolledCourses.slice(0, 4).map((course) => (
                  <div key={course.courseId} className="rounded-xl border border-indigo-100/70 p-3 dark:border-slate-700">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{course.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{course.progress || 0}%</p>
                    </div>
                    <ProgressBar value={course.progress || 0} />
                    <button
                      type="button"
                      onClick={() => navigate(`/courses/${course.courseId}`)}
                      className="mt-2 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:bg-slate-800 dark:text-indigo-300"
                    >
                      Resume
                    </button>
                  </div>
                ))
              )}
            </div>
          </SurfaceCard>

          <SurfaceCard className="rounded-2xl p-5">
            <SectionHeading title="Badge Showcase" subtitle="Achievement badges earned from real completion events." />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {badges.length === 0 ? (
                <p className="col-span-full text-sm text-slate-500 dark:text-slate-400">No badges unlocked yet.</p>
              ) : (
                badges.map((badge) => (
                  <div key={badge._id} className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-3 text-center text-white">
                    <FiAward className="mx-auto mb-2" />
                    <p className="text-xs font-medium">{badge.name}</p>
                  </div>
                ))
              )}
            </div>
          </SurfaceCard>

          <SurfaceCard className="rounded-2xl p-5">
            <SectionHeading title="Recent Activity" subtitle="Notifications generated from your achievements and learning events." />
            <div className="space-y-3 text-sm">
              {activity.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">No activity yet.</p>
              ) : (
                activity.map((event) => (
                  <div key={event._id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800">
                    <p className="text-slate-700 dark:text-slate-300">{event.title}</p>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                      <FiCheckCircle /> {event.type}
                    </span>
                  </div>
                ))
              )}
            </div>
          </SurfaceCard>

          <SurfaceCard className="rounded-2xl p-5">
            <SectionHeading title="XP Level Progression" />
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                <span>Level {levelInfo.level}</span>
                <span>
                  {profile?.xpPoints || 0} / {levelInfo.nextTarget} XP
                </span>
              </div>
              <ProgressBar value={levelInfo.pct} />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                <FiBarChart2 className="mr-1 inline" />
                {Math.max(levelInfo.nextTarget - (profile?.xpPoints || 0), 0)} XP needed for next level.
              </p>
            </div>
          </SurfaceCard>

          <SurfaceCard className="rounded-2xl p-5">
            <SectionHeading title="Certificates Summary" />
            <p className="text-sm text-slate-600 dark:text-slate-300">
              <FiAward className="mr-1 inline text-amber-500" />
              {certificates.length} issued certificates generated from completed courses.
            </p>
          </SurfaceCard>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;
