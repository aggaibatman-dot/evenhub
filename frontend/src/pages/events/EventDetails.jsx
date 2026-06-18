import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, MapPin, Users, ArrowLeft, CheckCircle, Ticket } from 'lucide-react';
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
      <div className="w-full max-w-5xl mx-auto py-8 animate-pulse space-y-8 relative z-10">
        <div className="h-96 glass-card rounded-2xl w-full opacity-50"></div>
        <div className="h-8 bg-white/10 w-1/2 rounded-lg"></div>
        <div className="space-y-4">
          <div className="h-4 bg-white/10 w-full rounded-lg"></div>
          <div className="h-4 bg-white/10 w-3/4 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (!event) return null;

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6 animate-fade-in relative z-10">
      <button 
        onClick={() => navigate('/events')}
        className="flex items-center text-slate-400 hover:text-white mb-6 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Events
      </button>

      <div className="glass-card overflow-hidden border-0 shadow-2xl mb-8 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-[#080416] via-transparent to-transparent z-10 pointer-events-none"></div>
        {event.bannerImage ? (
          <div className="w-full h-64 md:h-96 relative">
            <img src={`http://localhost:5000/${event.bannerImage.replace(/\\/g, '/')}`} alt={event.title} className="w-full h-full object-cover" />
            <div className="absolute bottom-6 left-6 right-6 z-20">
              <span className="glass-badge bg-black/40 backdrop-blur-md border-white/20 text-white mb-4 inline-block">
                {event.category}
              </span>
              <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white mb-2 drop-shadow-lg">{event.title}</h1>
            </div>
          </div>
        ) : (
          <div className="w-full h-64 md:h-[400px] bg-gradient-to-br from-violet-900 to-cyan-900 flex flex-col justify-end p-6 md:p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay"></div>
            <div className="z-20 relative">
              <span className="glass-badge bg-white/10 backdrop-blur-md border-white/20 text-white mb-4 inline-block">
                {event.category}
              </span>
              <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white mb-2 drop-shadow-lg">{event.title}</h1>
            </div>
          </div>
        )}

        <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-3 gap-10 relative z-20 bg-[#080416]/60 backdrop-blur-3xl border-t border-white/10">
          <div className="md:col-span-2 space-y-8">
            <div>
              <h3 className="text-2xl font-display font-bold text-white mb-4 flex items-center">
                <Ticket className="w-6 h-6 mr-3 text-violet-400" /> About This Event
              </h3>
              <p className="text-slate-300 leading-relaxed whitespace-pre-line text-lg">
                {event.description}
              </p>
            </div>
            
            <div className="pt-8 border-t border-white/10">
              <h3 className="text-xl font-display font-bold text-white mb-4">Organized By</h3>
              <div className="flex items-center">
                <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-full flex items-center justify-center font-bold text-2xl text-white mr-4 shadow-lg shadow-violet-500/30">
                  {event.organizer?.name?.charAt(0) || 'O'}
                </div>
                <div>
                  <p className="text-xl font-medium text-white">{event.organizer?.name || 'Organizer'}</p>
                  <p className="text-sm text-violet-400 font-medium">Verified Event Host</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="glass-card p-6 space-y-6 border-white/10 bg-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-[40px] rounded-full pointer-events-none"></div>
              
              <div className="flex items-start">
                <div className="p-2 rounded-xl bg-violet-500/20 mr-4">
                  <Calendar className="w-6 h-6 text-violet-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">Date & Time</p>
                  <p className="text-base text-white font-medium">{new Date(event.date).toLocaleDateString()}</p>
                  <p className="text-base text-white font-medium">{event.time}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 rounded-xl bg-cyan-500/20 mr-4">
                  <MapPin className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">Location</p>
                  <p className="text-base text-white font-medium">{event.venue}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="p-2 rounded-xl bg-orange-500/20 mr-4">
                  <Users className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">Capacity</p>
                  <p className="text-base text-white font-medium">{event.capacity} seats</p>
                </div>
              </div>
            </div>

            {hasRegistered ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 flex items-center text-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.15)] relative overflow-hidden">
                <div className="absolute inset-0 bg-emerald-500/5 pulse-glow pointer-events-none"></div>
                <CheckCircle className="w-8 h-8 mr-4 flex-shrink-0" />
                <div>
                  <p className="font-bold text-lg mb-0.5">Registered!</p>
                  <p className="text-sm text-emerald-400/80">You're on the guest list.</p>
                </div>
              </div>
            ) : (
              <button 
                onClick={handleRegister} 
                disabled={registering || event.status !== 'Published'}
                className="btn btn-primary w-full py-4 text-lg font-bold hover:scale-[1.02] shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10">{registering ? 'Processing...' : event.status !== 'Published' ? 'Not Available' : 'Secure Your Spot'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
