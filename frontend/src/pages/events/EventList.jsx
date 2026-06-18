import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, MapPin, Users, Search, Filter, Sparkles } from 'lucide-react';
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
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 animate-fade-in relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <div className="inline-flex items-center gap-2 glass-badge text-cyan-300 mb-3 glow-cyan">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover Now</span>
          </div>
          <h1 className="text-4xl font-display font-bold text-white tracking-tight">Explore Events</h1>
          <p className="text-slate-400 mt-2 text-lg">Find and join the best events happening around you.</p>
        </div>
        
        <div className="glass-card p-2 w-full md:w-auto">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search events..."
                className="w-full md:w-64 bg-white/5 border border-white/10 text-white pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all placeholder:text-slate-500"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <div className="relative flex-grow sm:flex-grow-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-slate-400" />
              </div>
              <select
                className="w-full sm:w-44 bg-white/5 border border-white/10 text-white pl-10 pr-4 py-2.5 rounded-xl appearance-none focus:outline-none focus:border-violet-500/50 focus:bg-white/10 transition-all"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="" className="dark:bg-slate-900 bg-white dark:text-white text-slate-900">All Categories</option>
                {categories.map(c => (
                  <option key={c} value={c} className="dark:bg-slate-900 bg-white dark:text-white text-slate-900">{c}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary whitespace-nowrap h-full shadow-none border-none py-2.5">Search</button>
          </form>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="animate-pulse glass-card h-[400px] overflow-hidden opacity-50">
              <div className="h-48 bg-white/5 w-full"></div>
              <div className="p-6 space-y-4">
                <div className="h-6 bg-white/10 w-3/4 rounded-lg"></div>
                <div className="h-4 bg-white/10 w-1/2 rounded-lg"></div>
                <div className="h-4 bg-white/10 w-2/3 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="glass-card p-16 text-center border-dashed border-2 border-white/10 max-w-2xl mx-auto">
          <div className="mx-auto bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mb-5">
            <Calendar className="w-10 h-10 text-slate-500" />
          </div>
          <h3 className="text-2xl font-display font-medium text-white mb-2">No events found</h3>
          <p className="text-slate-400 text-lg">We couldn't find any events matching your criteria. Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <Link key={event._id} to={`/events/${event._id}`} className="group glass-card flex flex-col h-full border border-white/10 overflow-hidden hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-500 relative">
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
              <div className="relative h-56 overflow-hidden">
                {event.bannerImage ? (
                  <img src={`http://localhost:5000/${event.bannerImage.replace(/\\/g, '/')}`} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" onError={(e) => { e.target.src = "/event_placeholder.png" }} />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-violet-600 to-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-700 relative">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30 mix-blend-overlay"></div>
                    <span className="text-white font-bold font-display text-2xl px-4 text-center z-10 drop-shadow-md">{event.title}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a2e] via-transparent to-transparent"></div>
                <div className="absolute top-4 right-4 z-10">
                  <span className="glass-badge bg-black/30 backdrop-blur-md border border-white/20 text-white shadow-lg">
                    {event.category}
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow relative z-20">
                <h3 className="text-xl font-display font-bold text-white mb-4 line-clamp-1 group-hover:text-cyan-300 transition-colors">
                  {event.title}
                </h3>
                <div className="space-y-3 mb-6 text-sm text-slate-300 flex-grow">
                  <div className="flex items-center group-hover:text-white transition-colors">
                    <div className="p-1.5 rounded-lg bg-violet-500/10 mr-3">
                      <Calendar className="w-4 h-4 text-violet-400" />
                    </div>
                    {new Date(event.date).toLocaleDateString()} at {event.time}
                  </div>
                  <div className="flex items-center group-hover:text-white transition-colors">
                    <div className="p-1.5 rounded-lg bg-cyan-500/10 mr-3">
                      <MapPin className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span className="line-clamp-1">{event.venue}</span>
                  </div>
                  <div className="flex items-center group-hover:text-white transition-colors">
                    <div className="p-1.5 rounded-lg bg-orange-500/10 mr-3">
                      <Users className="w-4 h-4 text-orange-400" />
                    </div>
                    Capacity: {event.capacity}
                  </div>
                </div>
                <div className="pt-4 border-t border-white/10 mt-auto flex justify-between items-center">
                  <span className="text-violet-400 font-medium text-sm group-hover:text-cyan-300 transition-colors">Explore Event</span>
                  <span className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-violet-500 group-hover:text-white text-slate-400 transition-all">
                    →
                  </span>
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
