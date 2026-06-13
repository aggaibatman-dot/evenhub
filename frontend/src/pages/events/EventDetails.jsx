import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, MapPin, Users, Tag, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [hasRegistered, setHasRegistered] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const { data } = await axios.get(`/api/events/${id}`);
        setEvent(data);
        
        // If user is logged in, theoretically we'd check if they are already registered.
        // For MVP frontend we'll assume not unless they click it, or we'd need an endpoint.
      } catch (error) {
        toast.error('Event not found');
        navigate('/events');
      } finally {
        setLoading(false);
      }
    };
    fetchEventData();
  }, [id, navigate]);

  const handleRegister = async () => {
    if (!user) {
      toast('Please login to register', { icon: 'ℹ️' });
      navigate('/login');
      return;
    }

    setRegistering(true);
    try {
      await axios.post(`/api/attendance/register/${id}`);
      toast.success('Successfully registered! Check your dashboard for the QR pass.');
      setHasRegistered(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto py-8 animate-pulse space-y-8">
        <div className="h-64 bg-gray-200 dark:bg-slate-700 rounded-2xl w-full"></div>
        <div className="h-8 bg-gray-200 dark:bg-slate-700 w-1/2 rounded"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-slate-700 w-full rounded"></div>
          <div className="h-4 bg-gray-200 dark:bg-slate-700 w-full rounded"></div>
        </div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 animate-fade-in">
      <button 
        onClick={() => navigate('/events')}
        className="flex items-center text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Events
      </button>

      <div className="card overflow-hidden border-0 shadow-lg mb-8">
        {event.bannerImage ? (
          <div className="w-full h-64 md:h-96 relative">
            <img src={event.bannerImage} alt={event.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <span className="px-3 py-1 bg-primary-600 text-white rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block">
                {event.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{event.title}</h1>
            </div>
          </div>
        ) : (
          <div className="w-full h-64 md:h-96 bg-gradient-to-br from-primary-600 to-indigo-900 flex flex-col justify-end p-6 md:p-10">
            <span className="px-3 py-1 bg-white/20 text-white rounded-full text-xs font-bold uppercase tracking-wider mb-3 inline-block w-max">
              {event.category}
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{event.title}</h1>
          </div>
        )}

        <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">About This Event</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>
            
            <div className="pt-6 border-t border-gray-100 dark:border-dark-border">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Organizer</h3>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 rounded-full flex items-center justify-center font-bold text-xl mr-4">
                  {event.organizer?.name?.charAt(0) || 'O'}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{event.organizer?.name || 'Organizer'}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Event Host</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card glass p-6 space-y-4">
              <div className="flex items-start">
                <Calendar className="w-5 h-5 text-primary-500 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Date and Time</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{new Date(event.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{event.time}</p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-primary-500 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Location</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{event.venue}</p>
                </div>
              </div>

              <div className="flex items-start">
                <Users className="w-5 h-5 text-primary-500 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Capacity</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{event.capacity} seats available</p>
                </div>
              </div>
            </div>

            {hasRegistered ? (
              <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center text-green-800 dark:text-green-300">
                <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0" />
                <p className="font-medium">You are registered for this event.</p>
              </div>
            ) : (
              <button 
                onClick={handleRegister} 
                disabled={registering || event.status !== 'Published'}
                className="btn btn-primary w-full py-4 text-lg font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
              >
                {registering ? 'Processing...' : event.status !== 'Published' ? 'Not Available' : 'Register Now'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
