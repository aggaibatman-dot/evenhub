import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Calendar, LayoutDashboard, Sun, Moon } from 'lucide-react';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-violet-600 dark:text-violet-500 tracking-tight">EventHub</span>
            </Link>
            {user && (
              <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                <Link to="/dashboard" className="text-slate-900 dark:text-slate-100 hover:text-violet-600 px-3 py-2 rounded-md text-sm font-medium inline-flex items-center transition-colors">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
                <Link to="/events" className="text-slate-900 dark:text-slate-100 hover:text-violet-600 px-3 py-2 rounded-md text-sm font-medium inline-flex items-center transition-colors">
                  <Calendar className="w-4 h-4 mr-2" />
                  Events
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {user ? (
              <div className="flex items-center gap-4 ml-2 border-l border-slate-200 dark:border-slate-700 pl-4">
                <div className="hidden md:flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <User className="w-4 h-4" />
                  <span>{user.name}</span>
                  <span className="px-2 py-0.5 rounded-full bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300 text-xs font-medium">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4 ml-2 border-l border-slate-200 dark:border-slate-700 pl-4">
                <Link to="/login" className="text-slate-700 dark:text-slate-300 hover:text-violet-600 px-3 py-2 text-sm font-medium transition-colors">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary text-sm px-4 py-2">
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
