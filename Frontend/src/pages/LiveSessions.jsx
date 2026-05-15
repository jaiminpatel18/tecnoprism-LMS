import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { motion } from 'framer-motion';
import { format, formatDistanceToNowStrict } from 'date-fns';
import { FiCalendar, FiClock, FiPlayCircle, FiUser, FiVideo } from 'react-icons/fi';
import Layout from '../components/Layout';
import { EmptyState, SectionHeading, SkeletonGrid, SurfaceCard } from '../components/UiPrimitives';
import { API_URL, authConfig } from '../utils/api';

function LiveSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState('All');
  const { token, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/sessions`, authConfig(token));
        setSessions(data.data || []);
      } catch (error) {
        console.error('Error fetching sessions', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [token]);

  const departments = useMemo(() => ['All', 'Engineering', 'Product', 'Design', 'Data'], []);

  const filteredSessions =
    department === 'All' ? sessions : sessions.filter((session) => (session.department || 'Engineering') === department);

  const isRegistered = (session) => Boolean(user?._id && session.attendees?.includes(user._id));

  const handleRegister = async (sessionId) => {
    try {
      await axios.post(`${API_URL}/api/sessions/${sessionId}/register`, {}, authConfig(token));
      setSessions((prev) =>
        prev.map((session) =>
          session._id === sessionId ? { ...session, attendees: [...(session.attendees || []), user._id] } : session,
        ),
      );
    } catch (error) {
      console.error('Error registering for session', error);
    }
  };

  return (
    <Layout title="Expert Sessions" subtitle="Join live discussions, AMAs, and mentorship sessions with domain experts.">
      <div className="space-y-5">
        <SurfaceCard className="rounded-2xl p-5">
          <SectionHeading title="Session Calendar" subtitle="Interactive sessions with countdown timers and join-ready controls." />
          <div className="flex flex-wrap gap-2">
            {departments.map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => setDepartment(dept)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  department === dept
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-slate-800 dark:text-indigo-300'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </SurfaceCard>

        {loading ? (
          <SkeletonGrid />
        ) : filteredSessions.length === 0 ? (
          <EmptyState
            icon={FiVideo}
            title="No expert sessions scheduled"
            description="There are no sessions for this department right now. Check another filter or come back soon."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filteredSessions.map((session, idx) => {
              const live = session.status === 'Live';
              const registered = isRegistered(session);
              const countdown = formatDistanceToNowStrict(new Date(session.scheduledAt), { addSuffix: true });
              return (
                <motion.article
                  key={session._id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`premium-card overflow-hidden rounded-2xl border ${live ? 'border-rose-300/70' : ''}`}
                >
                  <div className="p-5">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 dark:bg-slate-800 dark:text-indigo-300">
                        {(session.tags && session.tags[0]) || session.department || 'Learning'}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          live
                            ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                        }`}
                      >
                        {live ? 'LIVE NOW' : countdown}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{session.title}</h3>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{session.description}</p>

                    <div className="mt-4 grid grid-cols-1 gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <p className="inline-flex items-center gap-2">
                        <FiCalendar /> {format(new Date(session.scheduledAt), 'EEEE, MMM d')}
                      </p>
                      <p className="inline-flex items-center gap-2">
                        <FiClock /> {format(new Date(session.scheduledAt), 'h:mm a')} • {session.durationMinutes} mins
                      </p>
                      <p className="inline-flex items-center gap-2">
                        <FiUser /> {session.expert?.firstName} {session.expert?.lastName}
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-indigo-100/70 pt-4 dark:border-slate-700">
                      <span className="text-xs text-slate-500 dark:text-slate-400">{session.attendees?.length || 0} attending</span>
                      {registered ? (
                        <button
                          type="button"
                          onClick={() => navigate(`/sessions/${session._id}`)}
                          className="focus-ring inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-2 text-sm font-semibold text-white"
                        >
                          <FiPlayCircle />
                          {live ? 'Join live' : 'Open room'}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleRegister(session._id)}
                          className="focus-ring rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100 dark:border-slate-700 dark:bg-slate-800 dark:text-indigo-300"
                        >
                          Register
                        </button>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}

export default LiveSessions;
