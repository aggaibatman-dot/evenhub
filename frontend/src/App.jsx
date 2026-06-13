import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import Dashboard from './pages/dashboard/Dashboard';
import EventList from './pages/events/EventList';
import EventDetails from './pages/events/EventDetails';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference or local storage for theme
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  };

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-dark-bg transition-colors duration-200">
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          
          <main className="flex-grow flex items-center justify-center p-4">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/events" element={<EventList />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/" element={
                <div className="text-center animate-slide-up">
                  <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-500 mb-4">EventHub</h1>
                  <p className="text-gray-600 dark:text-gray-300 mb-8">Smart Event Management & QR Attendance System</p>
                  <div className="flex justify-center gap-4">
                    <a href="/events" className="btn btn-primary">Browse Events</a>
                    <a href="/register" className="btn btn-secondary">Join Now</a>
                  </div>
                </div>
              } />
            </Routes>
          </main>
        </div>
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;
