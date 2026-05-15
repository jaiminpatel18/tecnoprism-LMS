import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { FiAward, FiTrendingUp } from 'react-icons/fi';

function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get('http://localhost:5000/api/leaderboard', config);
        setLeaders(data.data);
      } catch (error) {
        console.error('Error fetching leaderboard', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [token]);

  return (
    <Layout 
      title="Company Leaderboard" 
      subtitle="See who is leading the upskilling charge at Tecnoprism."
    >
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <FiAward className="mr-2 text-blue-600" />
                All-Time Highest XP
            </h3>
            <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                Top {leaders.length}
            </span>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : leaders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">No data available on the leaderboard yet.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {leaders.map((leader, idx) => (
              <motion.li 
                key={leader._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-4 sm:px-6 hover:bg-gray-50 transition-colors flex items-center justify-between ${user?._id === leader._id ? 'bg-blue-50/50' : ''}`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center justify-center font-bold text-lg w-8 ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-gray-400' : idx === 2 ? 'text-amber-700' : 'text-gray-400'}`}>
                    #{idx + 1}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold border border-blue-200">
                     {leader.firstName.charAt(0)}{leader.lastName.charAt(0)}
                  </div>
                  <div>
                      <p className="text-sm font-semibold text-gray-900 flex items-center">
                        {leader.firstName} {leader.lastName}
                        {user?._id === leader._id && <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">You</span>}
                      </p>
                      <p className="text-xs text-gray-500">{leader.role} • 🔥 {leader.currentStreak} Day Streak</p>
                  </div>
                </div>
                <div className="text-right">
                    <p className="text-lg font-bold text-gray-900 flex items-center justify-end">
                       <FiTrendingUp className="mr-1.5 text-blue-500" /> {leader.xpPoints} <span className="text-sm font-normal text-gray-500 ml-1">XP</span>
                    </p>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
}

export default Leaderboard;
