import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { FiSend, FiArrowLeft, FiUsers, FiVideo, FiClock } from 'react-icons/fi';

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
    fetchSession();
    // Initialize socket
    socketRef.current = io('http://localhost:5000');
    
    // Join a specific room based on session ID
    socketRef.current.emit('join_session', id);
    
    // Listen for incoming messages
    socketRef.current.on('receive_message', (messageData) => {
      setMessages((prev) => [...prev, messageData]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [id]);

  useEffect(() => {
    // Scroll to bottom whenever messages update
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchSession = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      // Taking a shortcut by filtering since we don't have a unique getSession endpoint written yet
      const { data } = await axios.get('http://localhost:5000/api/sessions', config);
      const matchedSession = data.data.find(s => s._id === id);
      setSession(matchedSession);
    } catch (error) {
      console.error('Error fetching session details:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const messageData = {
      sessionId: id,
      text: newMessage,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName
      },
      time: new Date().toISOString()
    };

    // Emit message to server
    socketRef.current.emit('send_message', messageData);
    setNewMessage('');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="p-6 max-w-7xl mx-auto h-screen">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg shadow">Session not found</div>
        <button onClick={() => navigate('/sessions')} className="mt-4 text-primary font-medium hover:underline">
          &larr; Back to Sessions
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Main Content Area (Video Info / Player) */}
      <div className="flex-1 flex flex-col h-full bg-white shadow-lg z-10 overflow-y-auto">
        <div className="p-4 border-b border-gray-100 flex items-center shadow-sm">
          <button onClick={() => navigate('/sessions')} className="mr-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
            <FiArrowLeft className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{session.title}</h1>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${session.status === 'Live' ? 'bg-red-500 animate-pulse' : 'bg-gray-400'}`}></span>
              {session.status}
            </div>
          </div>
        </div>

        <div className="p-6 lg:p-12 flex-1 flex flex-col">
          <div className="bg-black text-white aspect-video w-full rounded-2xl flex flex-col items-center justify-center shadow-2xl relative">
             <FiVideo className="text-6xl text-gray-500 mb-4 opacity-50" />
             <h2 className="text-2xl font-bold mb-2 text-center">Session is external</h2>
             <p className="text-gray-400 mb-6 text-center max-w-md">
               This interactive session happens externally on {session.meetingLink.includes('zoom.us') ? 'Zoom' : 'Google Meet'}. 
             </p>
             <a 
               href={session.meetingLink}
               target="_blank"
               rel="noopener noreferrer"
               className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-bold transition-transform hover:scale-105"
             >
               Launch Externally
             </a>
          </div>

          <div className="mt-8 bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h3 className="font-bold text-lg text-gray-900 mb-2">About this Session</h3>
            <p className="text-gray-600">{session.description}</p>
            <div className="flex space-x-6 mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center text-gray-700">
                <FiUsers className="mr-2 text-secondary" /> {session.attendees.length} Attendees
              </div>
              <div className="flex items-center text-gray-700">
                <FiClock className="mr-2 text-secondary" /> {session.durationMinutes} min
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Chat Sidebar */}
      <div className="w-96 bg-gray-50 border-l border-gray-200 flex flex-col h-full shrink-0">
        <div className="p-4 border-b border-gray-200 bg-white">
          <h2 className="font-bold text-gray-800 flex items-center">
            Live Discussion
            <span className="ml-2 bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full text-xs">
              {messages.length}
            </span>
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              No messages yet. Be the first to start the discussion!
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMe = msg.user._id === user._id;
              return (
                <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <span className="text-xs text-gray-500 mb-1">
                    {isMe ? 'You' : `${msg.user.firstName} ${msg.user.lastName}`}
                  </span>
                  <div 
                    className={`px-4 py-2 rounded-2xl max-w-[80%] ${
                      isMe 
                        ? 'bg-primary text-white rounded-tr-none' 
                        : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-gray-200">
          <form onSubmit={sendMessage} className="flex space-x-2">
            <input 
              type="text" 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ask a question..." 
              className="flex-1 border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-primary focus:border-primary border outline-none"
            />
            <button 
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-primary hover:bg-primary-dark text-white rounded-lg p-2.5 transition-colors disabled:opacity-50"
            >
              <FiSend />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LiveSessionRoom;