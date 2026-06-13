import { useAuth } from '../../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import OrganizerDashboard from './OrganizerDashboard';
import ParticipantDashboard from './ParticipantDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {user.role === 'Admin' && <AdminDashboard />}
      {user.role === 'Organizer' && <OrganizerDashboard />}
      {user.role === 'Participant' && <ParticipantDashboard />}
    </div>
  );
};

export default Dashboard;
