import { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusCircle, QrCode, X, Calendar, MapPin, Share2 } from 'lucide-react';
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
    title: '', description: '', category: 'Workshop', venue: '', date: '', time: '', capacity: ''
  });
  const [bannerImage, setBannerImage] = useState(null);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const { data } = await axios.get('/api/events');
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
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="space-y-8 relative z-10 w-full max-w-7xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card flex flex-col md:flex-row justify-between items-start md:items-center p-8 md:p-12 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/30 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 mb-6 md:mb-0">
          <div className="inline-flex items-center gap-2 glass-badge text-cyan-300 mb-4 glow-cyan">
            <span>Organizer Console</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white mb-3 tracking-tight">Event <span className="text-gradient">Command Center</span></h1>
          <p className="text-slate-400 text-lg max-w-xl">Create spectacular events, manage registrations, and seamlessly check-in attendees.</p>
        </div>
        <button onClick={() => setIsCreateModalOpen(true)} className="btn btn-primary relative z-10 shadow-xl py-3 px-6 text-base group">
          <PlusCircle className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
          Create New Event
        </button>
      </motion.div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(n => <div key={n} className="h-80 glass-card animate-pulse opacity-50"></div>)}
        </div>
      ) : events.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-16 text-center border-dashed border-2 border-white/10">
          <div className="mx-auto bg-white/5 w-24 h-24 rounded-full flex items-center justify-center mb-6">
            <Calendar className="w-12 h-12 text-slate-500" />
          </div>
          <h3 className="text-3xl font-display font-bold text-white mb-3">No events created yet</h3>
          <p className="text-slate-400 mb-8 max-w-md mx-auto text-lg">It's quiet here. Create your first event to start managing registrations and building your community.</p>
          <button onClick={() => setIsCreateModalOpen(true)} className="btn btn-primary text-base px-8 py-3">Create Event</button>
        </motion.div>
      ) : (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {events.map((event) => (
            <motion.div key={event._id} variants={itemVariants} className="glass-card group overflow-hidden flex flex-col hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)] transition-all duration-500 border border-white/10">
              <div className="h-56 relative overflow-hidden">
                <img 
                  src={event.bannerImage ? `http://localhost:5000/${event.bannerImage.replace(/\\/g, '/')}` : "/event_placeholder.png"} 
                  alt={event.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  onError={(e) => { e.target.src = "/event_placeholder.png" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a2e]/90 via-[#0f0a2e]/40 to-transparent"></div>
                <div className="absolute bottom-5 left-5 right-5">
                  <span className="glass-badge bg-black/40 backdrop-blur-md border-white/20 text-white mb-3 shadow-lg inline-block">
                    {event.category}
                  </span>
                  <h3 className="text-2xl font-display font-bold text-white line-clamp-1">{event.title}</h3>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow bg-white/[0.02]">
                <div className="space-y-4 mb-6 text-sm text-slate-300">
                  <div className="flex items-center">
                    <div className="p-1.5 rounded-lg bg-violet-500/10 mr-3"><Calendar className="w-4 h-4 text-violet-400" /></div>
                    {new Date(event.date).toLocaleDateString()} at {event.time}
                  </div>
                  <div className="flex items-center">
                    <div className="p-1.5 rounded-lg bg-cyan-500/10 mr-3"><MapPin className="w-4 h-4 text-cyan-400" /></div>
                    <span className="line-clamp-1">{event.venue}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-5 mt-auto border-t border-white/10">
                  <span className={`glass-badge ${event.status === 'Upcoming' ? 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10' : 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'}`}>
                    {event.status || 'Upcoming'}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setShareEventId(event._id); setIsShareModalOpen(true); }}
                      className="p-2.5 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/10 transition-colors"
                      title="Show Registration QR"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleScanClick(event._id)}
                      className="btn bg-violet-500/20 text-violet-300 border border-violet-500/30 hover:bg-violet-500/30 hover:text-white transition-colors py-2 px-4 shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                    >
                      <QrCode className="w-4 h-4 mr-2" />
                      Scan
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
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 glass-overlay"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="glass-modal rounded-3xl w-full max-w-2xl overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/20 blur-[80px] pointer-events-none rounded-full"></div>
              <div className="flex justify-between items-center p-6 border-b border-white/10 relative z-10">
                <h2 className="text-2xl font-display font-bold text-white">Create New Event</h2>
                <button onClick={() => setIsCreateModalOpen(false)} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleCreateEvent} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto custom-scrollbar relative z-10">
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
                    <select className="input appearance-none bg-transparent" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                      <option className="dark:bg-slate-900 bg-white dark:text-white text-slate-900">Workshop</option>
                      <option className="dark:bg-slate-900 bg-white dark:text-white text-slate-900">Seminar</option>
                      <option className="dark:bg-slate-900 bg-white dark:text-white text-slate-900">Hackathon</option>
                      <option className="dark:bg-slate-900 bg-white dark:text-white text-slate-900">Cultural</option>
                      <option className="dark:bg-slate-900 bg-white dark:text-white text-slate-900">Technical</option>
                      <option className="dark:bg-slate-900 bg-white dark:text-white text-slate-900">Sports</option>
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
                    <input type="file" accept="image/*" className="block w-full text-sm text-slate-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border file:border-white/10 file:text-sm file:font-semibold file:bg-white/5 file:text-violet-300 hover:file:bg-white/10 transition-colors cursor-pointer" onChange={e => setBannerImage(e.target.files[0])} />
                  </div>
                </div>
                <div className="pt-6 mt-6 border-t border-white/10 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn btn-secondary py-2.5">Cancel</button>
                  <button type="submit" className="btn btn-primary py-2.5">Publish Event</button>
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
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 glass-overlay"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="glass-modal rounded-3xl p-10 max-w-sm w-full text-center relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 blur-[60px] rounded-full pointer-events-none"></div>
              <button onClick={() => { setIsShareModalOpen(false); setShareEventId(null); }} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-slate-400 transition-colors z-10">
                <X className="w-5 h-5" />
              </button>
              <h2 className="text-2xl font-display font-bold text-white mb-2 relative z-10">Registration QR</h2>
              <p className="text-sm text-slate-400 mb-8 relative z-10">Have participants scan this code to jump directly to the registration page.</p>
              <div className="bg-white p-4 rounded-2xl shadow-[0_0_40px_rgba(34,211,238,0.2)] inline-block mx-auto mb-8 relative z-10 glow-cyan">
                <QRCode value={`${window.location.origin}/events/${shareEventId}`} size={200} level="H" />
              </div>
              <button onClick={() => { setIsShareModalOpen(false); setShareEventId(null); }} className="btn btn-secondary w-full relative z-10 py-3">
                Done
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
