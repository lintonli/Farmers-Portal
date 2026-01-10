import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllFarmers, updateCertificationStatus, getUserFromToken, logoutUser } from '../Services/api';
import type { User } from '../Types';


const AdminDashboard = () => {
  const navigate = useNavigate();
  const [farmers, setFarmers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    const user = getUserFromToken();
    if (!user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    loadFarmers();
  }, []);

  const loadFarmers = async () => {
    try {
      const response = await getAllFarmers();
      setFarmers(response.users);
    } catch (err: any) {
      setError(err.message || 'Failed to load farmers');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (userId: string, status: 'certified' | 'declined' | 'pending') => {
    try {
      setUpdating(userId);
      await updateCertificationStatus(userId, { status });
      await loadFarmers();
      alert(`Status updated to ${status}`);
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const getStatusColors = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      certified: 'bg-green-100 text-green-800',
      declined: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg">{error}</div>
      </div>
    );
  }

  const pendingCount = farmers.filter(f => f.farmer?.certificationStatus === 'pending').length;
  const certifiedCount = farmers.filter(f => f.farmer?.certificationStatus === 'certified').length;
  const declinedCount = farmers.filter(f => f.farmer?.certificationStatus === 'declined').length;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Total Farmers</h3>
            <p className="text-3xl font-bold text-gray-800">{farmers.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Certified</h3>
            <p className="text-3xl font-bold text-green-600">{certifiedCount}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase mb-2">Declined</h3>
            <p className="text-3xl font-bold text-red-600">{declinedCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Farmers List</h2>
          </div>

          {farmers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No farmers registered yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Farm Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Crop Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {farmers.map(farmer => (
                    <tr key={farmer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {farmer.firstName} {farmer.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {farmer.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {farmer.farmer?.farmSize} acres
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {farmer.farmer?.cropType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColors(
                            farmer.farmer?.certificationStatus || 'pending'
                          )}`}
                        >
                          {farmer.farmer?.certificationStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(farmer.farmer?.appliedAt || '').toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => handleStatusUpdate(farmer.id, 'certified')}
                          disabled={updating === farmer.id || farmer.farmer?.certificationStatus === 'certified'}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                        >
                          Certify
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(farmer.id, 'declined')}
                          disabled={updating === farmer.id || farmer.farmer?.certificationStatus === 'declined'}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                        >
                          Decline
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;