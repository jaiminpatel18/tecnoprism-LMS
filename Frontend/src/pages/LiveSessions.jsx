import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { motion } from 'framer-motion';
import { format, formatDistanceToNowStrict } from 'date-fns';
import { FiCalendar, FiClock, FiPlayCircle, FiStar, FiUser, FiVideo } from 'react-icons/fi';
import Layout from '../components/Layout';
import { EmptyState, SectionHeading, SurfaceCard } from '../components/UiPrimitives';
import SessionCardSkeleton from '../components/skeletons/SessionCardSkeleton';
import { API_URL, authConfig } from '../utils/api';

function LiveSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [domain, setDomain] = useState('All');
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

  const domains = useMemo(
    () => [
      'All',
      'RPA',
      'Agentic AI',
      'AI Automation',
      'Intelligent Workflows',
      'Generative AI',
      'Workflow Orchestration',
    ],
    [],
  );

  const filteredSessions = domain === 'All' ? sessions : sessions.filter((session) => session.domain === domain);

  const isRegistered = (session) =>
    Boolean(
      user?._id &&
        (session.attendees || []).some((entry) => String(entry?._id || entry) === String(user._id)),
    );

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
    <Layout
      title="Expert Sessions"
      subtitle="Join AI + automation live sessions with internal experts, real-time Q&A, recordings, and rewards."
    >
      <div className="space-y-5">
        <SurfaceCard className="rounded-2xl p-5">
          <SectionHeading title="Session Calendar" subtitle="Track by automation domain and join sessions built for enterprise use cases." />
          <div className="flex flex-wrap gap-2">
            {domains.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setDomain(item)}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  domain === item
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-slate-800 dark:text-indigo-300'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </SurfaceCard>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {[...Array(4)].map((_, idx) => (
              <SessionCardSkeleton key={idx} />
            ))}
          </div>
        ) : filteredSessions.length === 0 ? (
            <EmptyState
              icon={FiVideo}
              title="No expert sessions scheduled"
              description="There are no sessions for this domain right now. Try another filter or check back soon."
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
                        {session.domain || (session.tags && session.tags[0]) || 'AI Automation'}
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
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        {session.sessionType || 'Live Workshop'}
                      </span>
                      {(session.technologies || []).slice(0, 2).map((tech) => (
                        <span
                          key={`${session._id}-${tech}`}
                          className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

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
                      <p className="inline-flex items-center gap-2">
                        <FiStar /> {session.averageRating || 0}/5 rating • {(session.feedbacks || []).length} feedback
                      </p>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-indigo-100/70 pt-4 dark:border-slate-700">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {session.attendees?.length || 0}/{session.maxAttendees || 100} attending
                      </span>
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
                    {session.recordingUrl ? (
                      <p className="mt-3 text-xs text-emerald-600 dark:text-emerald-300">
                        Recording available for this session.
                      </p>
                    ) : null}
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
