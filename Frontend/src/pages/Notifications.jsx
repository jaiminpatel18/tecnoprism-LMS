import { FiAlertCircle, FiBell, FiCheckCircle, FiMessageSquare, FiStar } from 'react-icons/fi';
import Layout from '../components/Layout';
import { SectionHeading, SurfaceCard } from '../components/UiPrimitives';

const notifications = [
  { title: 'New badge unlocked: Streak Master', type: 'achievement', time: '2h ago' },
  { title: 'Reminder: AI Architecture session starts in 45 mins', type: 'session', time: 'Today' },
  { title: 'Your blog got 18 new reactions', type: 'social', time: 'Yesterday' },
  { title: 'System update: New security learning track available', type: 'system', time: 'Yesterday' },
];

const iconByType = {
  achievement: FiStar,
  session: FiBell,
  social: FiMessageSquare,
  system: FiAlertCircle,
};

function Notifications() {
  return (
    <Layout title="Notifications" subtitle="Important updates, achievements, reminders, and collaborative activity.">
      <SurfaceCard className="rounded-2xl p-5">
        <SectionHeading
          title="Inbox"
          subtitle="Unread highlights and priority updates."
          action={<button className="rounded-lg bg-indigo-50 px-3 py-1.5 text-sm text-indigo-700 dark:bg-slate-800 dark:text-indigo-300">Mark all read</button>}
        />
        <div className="space-y-3">
          {notifications.map((notification, idx) => {
            const Icon = iconByType[notification.type];
            return (
              <div key={notification.title} className="flex items-start justify-between gap-3 rounded-xl border border-indigo-100/70 px-4 py-3 dark:border-slate-700">
                <div className="inline-flex items-start gap-3">
                  <span className="mt-0.5 rounded-lg bg-indigo-100 p-2 text-indigo-600 dark:bg-slate-800 dark:text-indigo-300">
                    <Icon />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{notification.title}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{notification.time}</p>
                  </div>
                </div>
                {idx < 2 ? (
                  <span className="rounded-full bg-rose-100 px-2 py-1 text-xs text-rose-600 dark:bg-rose-500/20 dark:text-rose-300">
                    New
                  </span>
                ) : (
                  <FiCheckCircle className="text-emerald-500" />
                )}
              </div>
            );
          })}
        </div>
      </SurfaceCard>
    </Layout>
  );
}

export default Notifications;
