import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Calendar, CheckCircle, Percent } from 'lucide-react';
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
    return <div className="animate-pulse flex flex-col space-y-4">
      <div className="h-32 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
      <div className="h-64 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
    </div>;
  }

  const chartData = [
    { name: 'Users', total: stats?.totalUsers || 0 },
    { name: 'Events', total: stats?.totalEvents || 0 },
    { name: 'Registrations', total: stats?.totalRegistrations || 0 },
    { name: 'Attendance', total: stats?.totalAttendances || 0 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalUsers}</p>
          </div>
        </div>
        
        <div className="card p-6 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
            <Calendar className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Events</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalEvents}</p>
          </div>
        </div>

        <div className="card p-6 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Attendances</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalAttendances}</p>
          </div>
        </div>

        <div className="card p-6 flex items-center space-x-4">
          <div className="p-3 rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300">
            <Percent className="w-8 h-8" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Attendance Rate</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.attendanceRate}%</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Platform Overview</h2>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
              <XAxis dataKey="name" stroke="#8884d8" />
              <YAxis stroke="#8884d8" />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff'}} />
              <Legend />
              <Bar dataKey="total" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* User Management */}
      <div className="card p-6 overflow-x-auto">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Management</h2>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
            {users.map((u) => (
              <tr key={u._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{u.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{u.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    u.role === 'Admin' ? 'bg-red-100 text-red-800' :
                    u.role === 'Organizer' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {u.isApproved ? (
                    <span className="text-green-600 font-medium">Active</span>
                  ) : (
                    <span className="text-yellow-600 font-medium">Pending</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {u.role === 'Organizer' && !u.isApproved && (
                    <button onClick={() => approveOrganizer(u._id)} className="text-primary-600 hover:text-primary-900 dark:hover:text-primary-400">
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
  );
};

export default AdminDashboard;
