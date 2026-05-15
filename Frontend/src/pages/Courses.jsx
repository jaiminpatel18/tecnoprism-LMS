import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { FiClock, FiStar } from 'react-icons/fi';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data } = await axios.get('http://localhost:5000/api/courses', config);
        setCourses(data.data);
      } catch (error) {
        console.error('Error fetching courses', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [token]);

  const handleEnroll = async (courseId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.post(`http://localhost:5000/api/courses/${courseId}/enroll`, {}, config);
      alert('Successfully enrolled in the course!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error enrolling in course');
    }
  };

  return (
    <Layout 
      title="Learning Library" 
      subtitle="Discover and enroll in upskilling paths specifically designed for you."
    >
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-medium text-gray-700">No courses available yet.</h3>
          <p className="text-gray-500 mt-2">Check back later for new upskilling content.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {courses.map((course, idx) => (
            <motion.div 
              key={course._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group flex flex-col"
            >
              <div className="h-48 bg-gradient-to-r from-blue-100 to-indigo-100 relative overflow-hidden">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex justify-center items-center text-blue-300 font-bold text-xl">
                    {course.category || 'Course Module'}
                  </div>
                )}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full text-blue-700 shadow flex items-center">
                  <FiStar className="mr-1" /> {course.pointsReward || 100} XP
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                  {course.category} • {course.level}
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                  {course.description}
                </p>
                
                <div className="mt-auto pt-6 flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                     <FiClock className="mr-1 hidden sm:block" /> {course.modules?.length || 0} Modules
                  </div>
                  <button 
                    onClick={() => navigate(`/courses/${course._id}`)}
                    className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                  >
                    View Course
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Layout>
  );
}

export default Courses;
