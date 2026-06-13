import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, MapPin, Users, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');

  const categories = ['Workshop', 'Seminar', 'Hackathon', 'Cultural', 'Technical', 'Sports'];

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/events?keyword=${keyword}&category=${category}`);
      setEvents(data);
    } catch (error) {
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [category]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Discover Events</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Find and join the best events happening around you.</p>
        </div>
        
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row w-full md:w-auto gap-2">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search events..."
              className="input pl-10 w-full md:w-64"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <div className="relative flex-grow sm:flex-grow-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="input pl-10 w-full sm:w-40 appearance-none"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary whitespace-nowrap">Search</button>
        </form>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="animate-pulse card h-80">
              <div className="h-40 bg-gray-200 dark:bg-slate-700 w-full"></div>
              <div className="p-4 space-y-3">
                <div className="h-6 bg-gray-200 dark:bg-slate-700 w-3/4 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-slate-700 w-1/2 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="card p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No events found</h3>
          <p className="text-gray-500 dark:text-gray-400">Try adjusting your search filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <Link key={event._id} to={`/events/${event._id}`} className="group card hover:-translate-y-1 transition-transform duration-300 flex flex-col h-full">
              <div className="relative h-48 overflow-hidden">
                {event.bannerImage ? (
                  <img src={event.bannerImage} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-400 to-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                    <span className="text-white font-bold text-2xl px-4 text-center">{event.title}</span>
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 bg-white/90 dark:bg-dark-bg/90 backdrop-blur-sm rounded-full text-xs font-semibold text-primary-600 dark:text-primary-400 shadow-sm">
                    {event.category}
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {event.title}
                </h3>
                <div className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-400 flex-grow">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-primary-500" />
                    {new Date(event.date).toLocaleDateString()} at {event.time}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-primary-500" />
                    <span className="line-clamp-1">{event.venue}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-primary-500" />
                    Capacity: {event.capacity}
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100 dark:border-dark-border mt-auto">
                  <span className="text-primary-600 dark:text-primary-400 font-medium text-sm">View Details &rarr;</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;
