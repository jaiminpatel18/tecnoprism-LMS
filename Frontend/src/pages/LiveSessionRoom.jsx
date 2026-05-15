import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { io } from 'socket.io-client';
import { format } from 'date-fns';
import { FiArrowLeft, FiClock, FiExternalLink, FiSend, FiUsers, FiVideo } from 'react-icons/fi';
import Layout from '../components/Layout';
import { EmptyState, SurfaceCard } from '../components/UiPrimitives';
import { API_URL, authConfig } from '../utils/api';

function LiveSessionRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/sessions`, authConfig(token));
        setSession(data.data.find((item) => item._id === id) || null);
      } catch (error) {
        console.error('Error fetching session', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [id, token]);

  useEffect(() => {
    socketRef.current = io(API_URL);
    socketRef.current.emit('join_session', id);
    socketRef.current.on('receive_message', (messageData) => {
      setMessages((prev) => [...prev, messageData]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      return;
    }

    const payload = {
      sessionId: id,
      text: newMessage,
      user: {
        _id: user?._id,
        firstName: user?.firstName,
        lastName: user?.lastName,
      },
      time: new Date().toISOString(),
    };

    socketRef.current.emit('send_message', payload);
    setNewMessage('');
  };

  const roomStatus = useMemo(() => (session?.status === 'Live' ? 'Live now' : 'Upcoming room'), [session?.status]);

  if (loading) {
    return (
      <Layout title="Expert Session Room" subtitle="Loading live room experience.">
        <div className="premium-card h-80 animate-pulse rounded-2xl bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800" />
      </Layout>
    );
  }

  if (!session) {
    return (
      <Layout title="Expert Session Room" subtitle="This session could not be found.">
        <EmptyState
          icon={FiVideo}
          title="Session not found"
          description="This room may have ended or you may not have access yet."
        />
      </Layout>
    );
  }

  return (
    <Layout title={session.title} subtitle={`Room status: ${roomStatus}`}>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.8fr_1fr]">
        <SurfaceCard className="rounded-2xl p-5">
          <button
            type="button"
            onClick={() => navigate('/sessions')}
            className="mb-4 inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-1.5 text-sm text-indigo-700 dark:bg-slate-800 dark:text-indigo-300"
          >
            <FiArrowLeft /> Back to sessions
          </button>

          <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-900 p-8 text-white">
            <p className="text-xs uppercase tracking-[0.2em] text-indigo-200">Live session environment</p>
            <h2 className="mt-2 text-2xl font-semibold">{session.title}</h2>
            <p className="mt-2 max-w-2xl text-sm text-indigo-100">{session.description}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
              <span className="rounded-full bg-white/15 px-3 py-1">
                <FiUsers className="mr-1 inline" /> {session.attendees?.length || 0} participants
              </span>
              <span className="rounded-full bg-white/15 px-3 py-1">
                <FiClock className="mr-1 inline" /> {session.durationMinutes} mins
              </span>
              <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-emerald-200">
                {format(new Date(session.scheduledAt), 'EEE, MMM d • h:mm a')}
              </span>
            </div>

            <a
              href={session.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700"
            >
              Launch external meeting <FiExternalLink />
            </a>
          </div>
        </SurfaceCard>

        <SurfaceCard className="flex h-[70vh] flex-col rounded-2xl p-0">
          <div className="border-b border-indigo-100/70 px-4 py-3 dark:border-slate-700">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Live Discussion</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Collaborative Q&A and peer exchange</p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.length === 0 ? (
              <p className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                No messages yet. Start the conversation.
              </p>
            ) : (
              messages.map((msg, index) => {
                const mine = msg.user?._id === user?._id;
                return (
                  <div key={`${msg.time}-${index}`} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                        mine
                          ? 'rounded-tr-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                          : 'rounded-tl-sm bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <p className="text-[11px] opacity-80">
                        {mine ? 'You' : `${msg.user?.firstName || ''} ${msg.user?.lastName || ''}`.trim()}
                      </p>
                      <p>{msg.text}</p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={sendMessage} className="border-t border-indigo-100/70 p-3 dark:border-slate-700">
            <div className="flex items-center gap-2 rounded-xl border border-indigo-200/70 bg-white/80 px-3 py-2 dark:border-slate-700 dark:bg-slate-900/80">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Ask a question..."
                className="focus-ring w-full bg-transparent text-sm text-slate-800 outline-none dark:text-slate-100"
              />
              <button
                type="submit"
                className="focus-ring rounded-lg bg-indigo-500 p-2 text-white transition hover:bg-indigo-600 disabled:opacity-60"
                disabled={!newMessage.trim()}
              >
                <FiSend />
              </button>
            </div>
          </form>
        </SurfaceCard>
      </div>
    </Layout>
  );
}

export default LiveSessionRoom;
