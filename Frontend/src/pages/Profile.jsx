import { useSelector } from 'react-redux';
import { FiAward, FiBarChart2, FiBookOpen, FiCheckCircle, FiFlame, FiStar } from 'react-icons/fi';
import Layout from '../components/Layout';
import { ProgressBar, SectionHeading, SurfaceCard } from '../components/UiPrimitives';

function Profile() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Layout title="Employee Profile" subtitle="Personal learning identity, achievements, and progress history.">
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.1fr_1.9fr]">
        <SurfaceCard className="rounded-2xl p-5">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 text-3xl font-semibold text-white">
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
              {user?.firstName} {user?.lastName}
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{user?.role || 'Learning Specialist'}</p>
            <div className="mt-4 rounded-xl bg-indigo-50 px-3 py-2 text-sm text-indigo-700 dark:bg-slate-800 dark:text-indigo-300">
              Level 12 • 2,480 XP
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Skills</p>
            <div className="flex flex-wrap gap-2">
              {['React', 'Node.js', 'System Design', 'Leadership', 'AI'].map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </SurfaceCard>

        <div className="space-y-5">
          <SurfaceCard className="rounded-2xl p-5">
            <SectionHeading title="Learning Stats" />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { label: 'Completed Courses', value: '11', icon: FiBookOpen },
                { label: 'Current Streak', value: '14 days', icon: FiFlame },
                { label: 'Certificates', value: '6', icon: FiAward },
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
            <SectionHeading title="Badge Showcase" subtitle="Recent achievement unlocks." />
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {['Streak Master', 'Fast Learner', 'Mentor Ally', 'Session Pro'].map((badge) => (
                <div key={badge} className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-3 text-center text-white">
                  <FiStar className="mx-auto mb-2" />
                  <p className="text-xs font-medium">{badge}</p>
                </div>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard className="rounded-2xl p-5">
            <SectionHeading title="Activity Feed" subtitle="Recent learning activity and milestone timeline." />
            <div className="space-y-3 text-sm">
              {[
                { action: 'Completed module: API Security Fundamentals', xp: '+90 XP' },
                { action: 'Earned badge: Streak Master', xp: '+40 XP' },
                { action: 'Submitted session feedback for Product Thinking', xp: '+10 XP' },
              ].map((event) => (
                <div key={event.action} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800">
                  <p className="text-slate-700 dark:text-slate-300">{event.action}</p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                    <FiCheckCircle /> {event.xp}
                  </span>
                </div>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard className="rounded-2xl p-5">
            <SectionHeading title="XP Level Progression" />
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                <span>Level 12</span>
                <span>2,480 / 2,800 XP</span>
              </div>
              <ProgressBar value={88} />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                <FiBarChart2 className="mr-1 inline" />
                Keep momentum for Level 13 unlock.
              </p>
            </div>
          </SurfaceCard>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;
