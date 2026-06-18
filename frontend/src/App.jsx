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
import { Sparkles, ArrowRight } from 'lucide-react';

function App() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (localStorage.theme === 'light') {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
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
        <div className="glass-bg min-h-screen flex flex-col">
          {/* Floating gradient orbs */}
          <div className="glass-orb glass-orb-1" aria-hidden="true" />
          <div className="glass-orb glass-orb-2" aria-hidden="true" />
          <div className="glass-orb glass-orb-3" aria-hidden="true" />

          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          
          <main className="flex-grow flex items-center justify-center p-4 relative z-10">
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
                <div className="text-center animate-slide-up max-w-2xl mx-auto px-4">
                  {/* Glowing badge */}
                  <div className="inline-flex items-center gap-2 glass-badge text-violet-300 mb-8 glow-violet">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Smart Event Management</span>
                  </div>

                  <h1 className="text-5xl md:text-7xl font-extrabold font-display mb-6 tracking-tight">
                    <span className="text-white">Event</span>
                    <span className="text-gradient">Hub</span>
                  </h1>
                  
                  <p className="text-lg text-slate-400 mb-10 max-w-lg mx-auto leading-relaxed">
                    Create, manage, and attend events with QR-based attendance tracking and instant certificate generation.
                  </p>
                  
                  <div className="flex justify-center gap-4 flex-wrap">
                    <a href="/events" className="btn btn-primary text-base px-8 py-3.5 group">
                      Browse Events
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </a>
                    <a href="/register" className="btn btn-secondary text-base px-8 py-3.5">
                      Join Now
                    </a>
                  </div>

                  {/* Decorative glass cards behind hero */}
                  <div className="mt-16 grid grid-cols-3 gap-4 max-w-md mx-auto opacity-40">
                    <div className="glass-card h-20 rounded-xl" />
                    <div className="glass-card h-24 rounded-xl -mt-2" />
                    <div className="glass-card h-20 rounded-xl" />
                  </div>
                </div>
              } />
            </Routes>
          </main>
        </div>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(15, 10, 40, 0.85)',
              backdropFilter: 'blur(20px)',
              color: '#e2e8f0',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
