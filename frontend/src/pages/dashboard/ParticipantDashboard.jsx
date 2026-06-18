import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Download, Search, Ticket } from 'lucide-react';
import toast from 'react-hot-toast';

const ParticipantDashboard = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch the user's specific registrations
    const fetchRegistrations = async () => {
      try {
        const { data } = await axios.get('/api/events');
        setUpcomingEvents(data.slice(0, 2)); // Mocking data for now
      } catch (error) {
        toast.error('Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };
    fetchRegistrations();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in relative z-10 w-full max-w-5xl mx-auto">
      
      {/* Header section with glass gradient */}
      <div className="glass-card p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-violet-500/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-cyan-500/20 transition-colors duration-1000" />
        <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">My Dashboard</h1>
            <p className="text-slate-400">Track your event registrations and certificates.</p>
          </div>
          <a href="/events" className="btn btn-primary flex items-center shadow-lg shadow-violet-500/20">
            <Search className="w-5 h-5 mr-2" />
            Browse More Events
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-display font-semibold text-white flex items-center">
            <Ticket className="w-5 h-5 mr-2 text-cyan-400" /> My Registered Events
          </h2>
          
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-28 glass-card rounded-2xl w-full opacity-50"></div>
              <div className="h-28 glass-card rounded-2xl w-full opacity-50"></div>
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="glass-card p-12 text-center border-dashed border-2 border-white/10">
              <div className="mx-auto bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No active registrations</h3>
              <p className="text-slate-400">You haven't registered for any upcoming events yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event._id} className="glass-card p-5 flex flex-col sm:flex-row justify-between items-center gap-5 transition-all hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]">
                  <div className="flex items-center gap-5 w-full">
                    <div className="h-16 w-16 rounded-2xl bg-white/10 border border-white/10 flex-shrink-0 flex flex-col items-center justify-center text-center backdrop-blur-md relative overflow-hidden">
                      <div className="absolute top-0 w-full h-1.5 bg-violet-500"></div>
                      <span className="text-xs text-violet-300 font-medium uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                      <span className="text-xl font-display font-bold text-white leading-none">{new Date(event.date).getDate()}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1 line-clamp-1">{event.title}</h3>
                      <p className="text-sm text-slate-400 flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 mr-2 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
                        {event.time} • {event.venue}
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full sm:w-auto gap-2">
                    <button className="btn btn-secondary w-full sm:w-auto whitespace-nowrap group">
                      View QR Pass
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-display font-semibold text-white flex items-center">
            <Download className="w-5 h-5 mr-2 text-violet-400" /> My Certificates
          </h2>
          <div className="glass-card p-10 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-cyan-500/5 pointer-events-none" />
            <div className="mx-auto bg-violet-500/10 border border-violet-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 glow-violet">
              <Download className="w-8 h-8 text-violet-400" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">No certificates yet</h3>
            <p className="text-sm text-slate-400">Attend an event to earn and download your first certificate.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParticipantDashboard;
