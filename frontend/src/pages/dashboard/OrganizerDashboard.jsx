import { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, QrCode, X, Calendar, MapPin, Users, Clock, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';
import QRScanner from '../../components/attendance/QRScanner';

const OrganizerDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [activeEventId, setActiveEventId] = useState(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareEventId, setShareEventId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', category: 'Conference', venue: '', date: '', time: '', capacity: ''
  });
  const [bannerImage, setBannerImage] = useState(null);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const { data } = await axios.get('/api/events');
      // For now, fetch all events (should be filtered by backend based on token)
      setEvents(data);
    } catch (error) {
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleScanClick = (eventId) => {
    setActiveEventId(eventId);
    setIsScannerOpen(true);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => formDataToSend.append(key, formData[key]));
    if (bannerImage) {
      formDataToSend.append('bannerImage', bannerImage);
    }

    try {
      await axios.post('/api/events', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('Event created successfully!');
      setIsCreateModalOpen(false);
      fetchMyEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create event');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-end bg-gradient-to-r from-violet-900/40 to-indigo-900/40 p-8 rounded-3xl border border-white/10 relative overflow-hidden"
      >
        <img src="/hero_background.png" alt="background" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Organizer <span className="text-gradient">Dashboard</span></h1>
          <p className="text-slate-300">Manage your upcoming spectacular events and check-in attendees.</p>
        </div>
        <button onClick={() => setIsCreateModalOpen(true)} className="btn btn-primary relative z-10 shadow-xl">
          <PlusCircle className="w-5 h-5 mr-2" />
          Create Event
        </button>
      </motion.div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(n => <div key={n} className="h-64 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-2xl"></div>)}
        </div>
      ) : events.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-16 text-center">
          <img src="/event_placeholder.png" alt="No events" className="w-64 h-48 object-cover rounded-xl mx-auto mb-6 shadow-2xl opacity-80" />
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No events created yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">It's quiet here. Create your first event to start managing registrations and building your community.</p>
          <button onClick={() => setIsCreateModalOpen(true)} className="btn btn-primary">Create Event</button>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {events.map((event) => (
            <motion.div key={event._id} variants={itemVariants} className="card group relative overflow-hidden">
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={event.bannerImage ? `http://localhost:5000/${event.bannerImage.replace(/\\/g, '/')}` : "/event_placeholder.png"} 
                  alt={event.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  onError={(e) => { e.target.src = "/event_placeholder.png" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500 text-white shadow-lg mb-2">
                    {event.category}
                  </span>
                  <h3 className="text-xl font-bold text-white line-clamp-1">{event.title}</h3>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                  <Calendar className="w-4 h-4 mr-2 text-violet-500" />
                  {new Date(event.date).toLocaleDateString()} at {event.time}
                </div>
                <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                  <MapPin className="w-4 h-4 mr-2 text-violet-500" />
                  {event.venue}
                </div>
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${
                    event.status === 'Upcoming' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300' : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                  }`}>
                    {event.status || 'Upcoming'}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setShareEventId(event._id); setIsShareModalOpen(true); }}
                      className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                      title="Show Registration QR"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleScanClick(event._id)}
                      className="btn btn-secondary text-sm px-4 py-2 flex items-center hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:text-violet-600 dark:hover:text-violet-300 transition-colors"
                    >
                      <QrCode className="w-4 h-4 mr-2" />
                      Scan QR
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Create Event Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create New Event</h2>
                <button onClick={() => setIsCreateModalOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleCreateEvent} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="label">Event Title</label>
                  <input type="text" className="input" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Tech Innovators 2026" />
                </div>
                <div>
                  <label className="label">Description</label>
                  <textarea className="input" rows="3" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="What is this event about?"></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="label">Category</label>
                    <select className="input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                      <option>Conference</option>
                      <option>Workshop</option>
                      <option>Hackathon</option>
                      <option>Meetup</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Venue</label>
                    <input type="text" className="input" required value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} placeholder="Location" />
                  </div>
                  <div>
                    <label className="label">Date</label>
                    <input type="date" className="input" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                  </div>
                  <div>
                    <label className="label">Time</label>
                    <input type="time" className="input" required value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                  </div>
                  <div>
                    <label className="label">Capacity</label>
                    <input type="number" className="input" required min="1" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} placeholder="e.g. 500" />
                  </div>
                  <div>
                    <label className="label">Banner Image</label>
                    <input type="file" accept="image/*" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 dark:file:bg-slate-800 dark:file:text-violet-400 transition-colors" onChange={e => setBannerImage(e.target.files[0])} />
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn btn-secondary">Cancel</button>
                  <button type="submit" className="btn btn-primary">Publish Event</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Registration QR Modal */}
      <AnimatePresence>
        {isShareModalOpen && shareEventId && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center border border-slate-200 dark:border-slate-800 relative"
            >
              <button onClick={() => { setIsShareModalOpen(false); setShareEventId(null); }} className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Registration QR</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Have participants scan this code to jump directly to the registration page.</p>
              <div className="bg-white p-4 rounded-2xl shadow-inner inline-block mx-auto mb-6">
                <QRCode 
                  value={`${window.location.origin}/events/${shareEventId}`} 
                  size={200}
                  level="H"
                />
              </div>
              <button 
                onClick={() => { setIsShareModalOpen(false); setShareEventId(null); }} 
                className="btn btn-secondary w-full"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {isScannerOpen && (
        <QRScanner eventId={activeEventId} onClose={() => { setIsScannerOpen(false); setActiveEventId(null); }} />
      )}
    </div>
  );
};

export default OrganizerDashboard;
