import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Calendar, CheckCircle, Percent, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          axios.get('/api/admin/analytics'),
          axios.get('/api/admin/users')
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        toast.error('Failed to load admin analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const approveOrganizer = async (id) => {
    try {
      await axios.put(`/api/admin/users/${id}/approve`);
      toast.success('Organizer approved successfully');
      setUsers(users.map(u => u._id === id ? { ...u, isApproved: true } : u));
    } catch (error) {
      toast.error('Failed to approve organizer');
    }
  };

  if (loading) {
    return <div className="animate-pulse flex flex-col space-y-6">
      <div className="h-32 glass-card rounded-2xl w-full opacity-50"></div>
      <div className="h-80 glass-card rounded-2xl w-full opacity-50"></div>
    </div>;
  }

  const chartData = [
    { name: 'Users', total: stats?.totalUsers || 0 },
    { name: 'Events', total: stats?.totalEvents || 0 },
    { name: 'Registrations', total: stats?.totalRegistrations || 0 },
    { name: 'Attendance', total: stats?.totalAttendances || 0 },
  ];

  return (
    <div className="space-y-8 animate-fade-in relative z-10 w-full max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-violet-500/20 rounded-lg border border-violet-500/30">
          <Activity className="w-6 h-6 text-violet-400" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">Admin Overview</h1>
          <p className="text-slate-400 text-sm mt-1">Platform analytics and user management</p>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-stat p-6 flex items-center space-x-4 group glow-blue">
          <div className="p-3.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 group-hover:bg-blue-500/20 transition-colors">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Total Users</p>
            <p className="text-3xl font-display font-bold text-white tracking-tight">{stats?.totalUsers}</p>
          </div>
        </div>
        
        <div className="glass-stat p-6 flex items-center space-x-4 group glow-green">
          <div className="p-3.5 rounded-xl bg-green-500/10 text-green-400 border border-green-500/20 group-hover:bg-green-500/20 transition-colors">
            <Calendar className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Total Events</p>
            <p className="text-3xl font-display font-bold text-white tracking-tight">{stats?.totalEvents}</p>
          </div>
        </div>

        <div className="glass-stat p-6 flex items-center space-x-4 group glow-purple">
          <div className="p-3.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 group-hover:bg-purple-500/20 transition-colors">
            <CheckCircle className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Attendances</p>
            <p className="text-3xl font-display font-bold text-white tracking-tight">{stats?.totalAttendances}</p>
          </div>
        </div>

        <div className="glass-stat p-6 flex items-center space-x-4 group glow-orange">
          <div className="p-3.5 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 group-hover:bg-orange-500/20 transition-colors">
            <Percent className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Attendance Rate</p>
            <p className="text-3xl font-display font-bold text-white tracking-tight">{stats?.attendanceRate}%</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-display font-semibold text-white mb-6 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-cyan-400" /> Platform Metrics
        </h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" axisLine={false} tickLine={false} />
              <YAxis stroke="rgba(255,255,255,0.5)" axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{fill: 'rgba(255,255,255,0.05)'}} 
                contentStyle={{backgroundColor: 'rgba(15, 10, 40, 0.85)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff'}} 
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="total" fill="url(#colorUv)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* User Management */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-display font-semibold text-white flex items-center">
            <Users className="w-5 h-5 mr-2 text-violet-400" /> User Directory
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="font-medium text-white">{u.name}</td>
                  <td className="text-slate-400">{u.email}</td>
                  <td>
                    <span className={`glass-badge ${
                      u.role === 'Admin' ? 'text-rose-400 border-rose-500/30 glow-sm bg-rose-500/10' :
                      u.role === 'Organizer' ? 'text-blue-400 border-blue-500/30 bg-blue-500/10' : 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    {u.isApproved ? (
                      <span className="flex items-center text-emerald-400 text-sm font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center text-amber-400 text-sm font-medium">
                        <span className="w-2 h-2 rounded-full bg-amber-400 mr-2 shadow-[0_0_8px_rgba(251,191,36,0.8)]"></span>
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="text-sm font-medium">
                    {u.role === 'Organizer' && !u.isApproved && (
                      <button onClick={() => approveOrganizer(_id)} className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-violet-300 transition-colors">
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
