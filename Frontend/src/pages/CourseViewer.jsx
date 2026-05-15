import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { FiPlayCircle, FiCheckCircle, FiFileText, FiAward, FiArrowLeft } from 'react-icons/fi';

const CourseViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [activeModule, setActiveModule] = useState(0);
  const [activeLesson, setActiveLesson] = useState(0);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      const { data } = await axios.get(`http://localhost:5000/api/courses/${id}`, config);
      setCourse(data.data);
      
      // Check if user is enrolled
      if (user && data.data.enrolledUsers.includes(user._id)) {
        setEnrolled(true);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load course');
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      await axios.post(`http://localhost:5000/api/courses/${id}/enroll`, {}, config);
      setEnrolled(true);
      setEnrolling(false);
    } catch (err) {
      console.error(err);
      setError('Failed to enroll');
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="p-6 max-w-7xl mx-auto h-screen">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg shadow">{error || 'Course not found'}</div>
        <button onClick={() => navigate('/courses')} className="mt-4 text-primary font-medium hover:underline">
          &larr; Back to Courses
        </button>
      </div>
    );
  }

  const currentLessonData = course.modules?.[activeModule]?.lessons?.[activeLesson];

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/courses')}
              className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
            >
              <FiArrowLeft className="text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">{course.title}</h1>
          </div>
          <div className="flex space-x-4 items-center">
            <div className="flex items-center text-secondary font-medium bg-secondary/10 px-3 py-1 rounded-full text-sm">
              <FiAward className="mr-1" />
              {course.pointsReward} XP
            </div>
            {!enrolled && (
              <button 
                onClick={handleEnroll}
                disabled={enrolling}
                className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition disabled:opacity-50"
              >
                {enrolling ? 'Enrolling...' : 'Enroll Now'}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player Placeholder */}
            {enrolled ? (
              <div className="bg-black rounded-xl aspect-video flex flex-col items-center justify-center relative overflow-hidden group shadow-lg">
                {currentLessonData?.videoUrl ? (
                   // Replace this with actual video player like react-player if a real URL is provided
                  <div className="text-white">Video Player: {currentLessonData?.videoUrl}</div>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4">
                      <FiPlayCircle className="text-white text-3xl" />
                    </div>
                    <h3 className="text-white font-medium text-lg text-center px-4">
                      {currentLessonData?.title || 'Watch Lesson'}
                    </h3>
                    <p className="text-gray-400 text-sm mt-2">
                      {currentLessonData?.durationMinutes} mins
                    </p>
                  </>
                )}
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                  <button className="bg-primary text-white px-6 py-2 rounded-full font-medium shadow-lg hover:scale-105 transform transition">
                    Play Video
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gray-200 rounded-xl aspect-video flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center opacity-30 blur-sm" style={{ backgroundImage: `url(${course.thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000'})` }}></div>
                <div className="relative z-10 flex flex-col items-center">
                  <FiPlayCircle className="text-gray-500 text-5xl mb-4" />
                  <h3 className="text-gray-700 font-semibold text-xl">Enroll to Start Learning</h3>
                </div>
              </div>
            )}

            {/* Lesson Info */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {currentLessonData?.title || course.title}
              </h2>
              <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
                <span className="flex items-center">
                  <FiFileText className="mr-1" />
                  Lesson {activeLesson + 1}
                </span>
                <span>•</span>
                <span>{currentLessonData?.durationMinutes || 0} mins</span>
              </div>
              <div className="prose max-w-none text-gray-700">
                <p>{currentLessonData?.description || course.description}</p>
              </div>
              
              {enrolled && (
                <div className="mt-8 flex justify-end">
                  <button className="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium transition">
                    <FiCheckCircle className="mr-2 text-green-500" /> Mark as Completed
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Course Curriculum */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow overflow-hidden sticky top-6">
              <div className="p-4 bg-gray-50 border-b border-gray-100">
                <h3 className="font-bold text-gray-800">Course Content</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {course.modules?.length || 0} modules
                </p>
              </div>
              
              <div className="divide-y divide-gray-100 max-h-[calc(100vh-250px)] overflow-y-auto">
                {course.modules?.map((module, mIndex) => (
                  <div key={mIndex} className="bg-white">
                    <div className="p-4 bg-gray-50/50">
                      <h4 className="font-semibold text-gray-800 text-sm">
                        Module {mIndex + 1}: {module.title}
                      </h4>
                    </div>
                    <div>
                      {module.lessons?.map((lesson, lIndex) => {
                        const isActive = activeModule === mIndex && activeLesson === lIndex;
                        return (
                          <div 
                            key={lIndex}
                            onClick={() => enrolled && (setActiveModule(mIndex), setActiveLesson(lIndex))}
                            className={`p-4 pl-8 flex items-start space-x-3 cursor-pointer transition ${
                              isActive ? 'bg-primary/5 border-l-4 border-primary' : 'hover:bg-gray-50 border-l-4 border-transparent'
                            } ${!enrolled ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <div className="mt-0.5">
                              {isActive ? (
                                <FiPlayCircle className="text-primary" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium truncate ${isActive ? 'text-primary' : 'text-gray-700'}`}>
                                {lesson.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {lesson.durationMinutes} mins
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CourseViewer;