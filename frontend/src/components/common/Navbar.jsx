import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Calendar, LayoutDashboard, Sun, Moon, Sparkles } from 'lucide-react';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-navbar sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <Sparkles className="w-6 h-6 text-violet-400 mr-2 group-hover:animate-pulse-glow" />
              <span className="text-2xl font-bold font-display text-white tracking-tight text-gradient">EventHub</span>
            </Link>
            {user && (
              <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
                <Link to="/dashboard" className="text-slate-300 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg text-sm font-medium inline-flex items-center transition-all">
                  <LayoutDashboard className="w-4 h-4 mr-2 opacity-70" />
                  Dashboard
                </Link>
                <Link to="/events" className="text-slate-300 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg text-sm font-medium inline-flex items-center transition-all">
                  <Calendar className="w-4 h-4 mr-2 opacity-70" />
                  Events
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-slate-400 hover:bg-white/10 hover:text-white transition-all"
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="flex items-center gap-4 ml-2 border-l border-white/10 pl-4">
                <div className="hidden md:flex items-center gap-2 text-sm text-slate-300">
                  <div className="glass-icon p-1.5 mr-1">
                    <User className="w-4 h-4 text-violet-300" />
                  </div>
                  <span className="font-medium text-white">{user.name}</span>
                  <span className="glass-badge glow-violet text-violet-300 ml-1">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-all"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-2 border-l border-white/10 pl-4">
                <Link to="/login" className="text-slate-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors hover:bg-white/5 rounded-lg">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary text-sm px-4 py-2 shadow-none">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
