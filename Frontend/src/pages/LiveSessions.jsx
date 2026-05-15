import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { FiCalendar, FiClock, FiVideo, FiUser, FiCheckCircle } from 'react-icons/fi';
import { format } from 'date-fns';

function LiveSessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get('http://localhost:5000/api/sessions', config);
        setSessions(data.data);
      } catch (error) {
        console.error('Error fetching sessions', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [token]);

  const handleRegister = async (sessionId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`http://localhost:5000/api/sessions/${sessionId}/register`, {}, config);
      alert('Successfully registered for the session!');
      
      // Update local state to reflect registration
      setSessions(sessions.map(session => {
        if (session._id === sessionId) {
          return { ...session, attendees: [...session.attendees, user._id] };
        }
        return session;
      }));
    } catch (error) {
      alert(error.response?.data?.message || 'Error registering for session');
    }
  };

  const isUserRegistered = (session) => {
    return user && session.attendees.includes(user._id);
  };

  return (
    <Layout 
      title="Live Sessions" 
      subtitle="Join interactive sessions hosted by Tecnoprism experts."
    >
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <FiVideo className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-xl font-medium text-gray-700">No live sessions scheduled</h3>
          <p className="text-gray-500 mt-2">Check back soon for new expert masterclasses and Q&A sessions.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {sessions.map((session, idx) => {
            const registered = isUserRegistered(session);
            const isLive = session.status === 'Live';
            
            return (
              <motion.div 
                key={session._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`bg-white rounded-xl overflow-hidden shadow-sm border ${isLive ? 'border-red-300' : 'border-gray-100'} hover:shadow-md transition-shadow flex flex-col`}
              >
                <div className={`p-6 ${isLive ? 'bg-red-50/50' : ''}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex space-x-2">
                       {session.tags?.map(tag => (
                         <span key={tag} className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide">
                           {tag}
                         </span>
                       ))}
                    </div>
                    {isLive ? (
                      <span className="flex items-center text-xs font-bold text-red-600 bg-red-100 px-3 py-1 rounded-full animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-red-600 mr-2"></span> LIVE NOW
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {session.status}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{session.title}</h3>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                    {session.description}
                  </p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-gray-700">
                      <FiCalendar className="mr-3 text-secondary" />
                      {format(new Date(session.scheduledAt), 'EEEE, MMMM do, yyyy')}
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <FiClock className="mr-3 text-secondary" />
                      {format(new Date(session.scheduledAt), 'h:mm a')} • {session.durationMinutes} minutes
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                      <FiUser className="mr-3 text-secondary" />
                      Hosted by: <span className="font-medium ml-1">{session.expert?.firstName} {session.expert?.lastName}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-500">
                      {session.attendees.length} attending
                    </div>
                    
                    {registered ? (
                      isLive ? (
                        <button
                          onClick={() => navigate(`/sessions/${session._id}`)}
                          className="bg-red-600 text-white hover:bg-red-700 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors flex items-center shadow-lg shadow-red-200"
                        >
                          <FiVideo className="mr-2" /> Enter Discussion Room
                        </button>
                      ) : (
                        <button 
                          onClick={() => navigate(`/sessions/${session._id}`)}
                          className="bg-green-50 text-green-700 hover:bg-green-100 px-5 py-2.5 rounded-lg font-medium text-sm flex items-center border border-green-200 transition-colors"
                        >
                          <FiCheckCircle className="mr-2" /> Go to Room
                        </button>
                      )
                    ) : (
                      <button 
                        onClick={() => handleRegister(session._id)}
                        className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors"
                      >
                        Register Now
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}

export default LiveSessions;