import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Download, Search } from 'lucide-react';
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
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Dashboard</h1>
        <button className="btn btn-primary flex items-center">
          <Search className="w-5 h-5 mr-2" />
          Browse More Events
        </button>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Registered Events</h2>
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-24 bg-gray-200 dark:bg-slate-700 rounded-xl w-full"></div>
            <div className="h-24 bg-gray-200 dark:bg-slate-700 rounded-xl w-full"></div>
          </div>
        ) : upcomingEvents.length === 0 ? (
          <div className="card p-8 text-center">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">You haven't registered for any events yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event._id} className="card p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4 w-full">
                  <div className="h-16 w-16 rounded-lg bg-primary-100 dark:bg-primary-900 flex-shrink-0 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-xl">
                    {new Date(event.date).getDate()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{event.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(event.date).toLocaleDateString()} at {event.time} • {event.venue}</p>
                  </div>
                </div>
                <div className="flex w-full sm:w-auto gap-2">
                  <button className="btn btn-secondary w-full sm:w-auto flex items-center justify-center">
                    View QR Pass
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Certificates</h2>
        <div className="card p-8 text-center">
          <Download className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">Attend an event to earn your first certificate.</p>
        </div>
      </div>
    </div>
  );
};

export default ParticipantDashboard;
