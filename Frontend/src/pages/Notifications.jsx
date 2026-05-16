import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';
import { FiAlertCircle, FiBell, FiCheckCircle, FiMessageSquare, FiStar, FiBookOpen } from 'react-icons/fi';
import Layout from '../components/Layout';
import { SectionHeading, SurfaceCard } from '../components/UiPrimitives';

const iconByType = {
  GAMIFICATION: FiStar,
  SESSION: FiBell,
  social: FiMessageSquare,
  SYSTEM: FiAlertCircle,
  COURSE: FiBookOpen,
  INFO: FiBell,
  WARNING: FiAlertCircle,
  SUCCESS: FiCheckCircle
};

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchNotifications();
  }, [token]);

  const fetchNotifications = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get('http://localhost:5000/api/notifications', config);
      setNotifications(data.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put('http://localhost:5000/api/notifications/read', {}, config);
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  return (
    <Layout title="Notifications" subtitle="Important updates, achievements, reminders, and collaborative activity.">
      <SurfaceCard className="rounded-2xl p-5">
        <SectionHeading
          title="Inbox"
          subtitle="Unread highlights and priority updates."
          action={
            <button 
              onClick={markAllRead} 
              className="rounded-lg bg-indigo-50 px-3 py-1.5 text-sm text-indigo-700 hover:bg-indigo-100 transition dark:bg-slate-800 dark:text-indigo-300"
            >
              Mark all read
            </button>
          }
        />
        <div className="space-y-3 mt-4">
          {loading ? (
             <div className="text-center text-slate-500 py-10">Loading notifications...</div>
          ) : notifications.length === 0 ? (
             <div className="text-center text-slate-500 py-10 flex flex-col items-center">
                <FiCheckCircle className="h-10 w-10 text-emerald-500 mb-3" />
                <p>You&apos;re all caught up!</p>
             </div>
          ) : notifications.map((notification) => {
            const Icon = iconByType[notification.type] || FiBell;
            return (
              <div key={notification._id} className={`flex items-start justify-between gap-3 rounded-xl border px-4 py-3 transition ${notification.read ? 'border-transparent bg-slate-50 dark:bg-slate-800/50 opacity-75' : 'border-indigo-100 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800'}`}>
                <div className="inline-flex items-start gap-3">
                  <span className={`mt-0.5 rounded-lg p-2 ${notification.read ? 'bg-slate-100 text-slate-500 dark:bg-slate-700' : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300'}`}>
                    <Icon />
                  </span>
                  <div>
                    <p className={`text-sm ${notification.read ? 'text-slate-600 dark:text-slate-400' : 'font-semibold text-slate-900 dark:text-slate-100'}`}>
                      {notification.title}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-500">{notification.message}</p>
                    <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                {!notification.read ? (
                  <span className="shrink-0 rounded-full bg-rose-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:bg-rose-500/20 dark:text-rose-300">
                    New
                  </span>
                ) : (
                  <FiCheckCircle className="text-emerald-500 shrink-0 mt-1 opacity-50" />
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
