import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa'; // React icons for student and teacher
import Teacher from './components/Teacher';
import Student from './components/Student';

function WelcomeScreen() {
  const navigate = useNavigate();

  const goToPanel = (panel) => {
    navigate(`/${panel}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to the Polling System</h1>
      <div className="flex gap-8 justify-center">
        <div className="flex flex-col items-center">
          <FaUserGraduate size={64} className="text-blue-500 mb-4" />
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 transition"
            onClick={() => goToPanel('student')}
          >
            Go to Student
          </button>
        </div>
        <div className="flex flex-col items-center">
          <FaChalkboardTeacher size={64} className="text-green-500 mb-4" />
          <button
            className="px-6 py-3 bg-green-500 text-white rounded-md shadow-md hover:bg-green-600 transition"
            onClick={() => goToPanel('teacher')}
          >
            Go to Teacher
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/teacher" element={<Teacher />} />
        <Route path="/student" element={<Student />} />
      </Routes>
    </Router>
  );
}

export default App;
