import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFarmerStatus, getUserFromToken, logoutUser } from '../Services/api';
import type { FarmerStatusResponse } from '../Types';

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const [farmerData, setFarmerData] = useState<FarmerStatusResponse['farmer'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFarmerStatus();
  }, []);

  const loadFarmerStatus = async () => {
    try {
      const user = getUserFromToken();
      if (!user || user.role !== 'farmer') {
        navigate('/login');
        return;
      }

      const response = await getFarmerStatus(user.sub);
      setFarmerData(response.farmer);
    } catch (err: any) {
      setError(err.message || 'Failed to load status');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const getStatusColors = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      certified: 'bg-green-100 text-green-800 border-green-300',
      declined: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[status as keyof typeof colors] || '';
  };

  const getStatusMessage = (status: string) => {
    const messages = {
      pending: 'Your application is being reviewed',
      certified: 'Congratulations! You are certified',
      declined: 'Your application was declined',
    };
    return messages[status as keyof typeof messages] || '';
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

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Farmer Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {farmerData && (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-1">
              Welcome, {farmerData.name}!
            </h2>
            <p className="text-gray-600">{farmerData.email}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Certification Status</h3>
            <div
              className={`inline-block px-4 py-2 rounded-full font-semibold text-sm border-2 ${getStatusColors(
                farmerData.certificationStatus
              )}`}
            >
              {farmerData.certificationStatus.toUpperCase()}
            </div>
            <p className="text-gray-600 mt-3">{getStatusMessage(farmerData.certificationStatus)}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-6">
              <label className="text-sm font-medium text-gray-500 uppercase">Farm Size</label>
              <p className="text-2xl font-semibold text-gray-800 mt-1">{farmerData.farmSize} acres</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <label className="text-sm font-medium text-gray-500 uppercase">Crop Type</label>
              <p className="text-2xl font-semibold text-gray-800 mt-1">{farmerData.cropType}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <label className="text-sm font-medium text-gray-500 uppercase">Application Date</label>
              <p className="text-2xl font-semibold text-gray-800 mt-1">
                {new Date(farmerData.appliedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <button
            onClick={loadFarmerStatus}
            className="w-full bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition"
          >
            Refresh Status
          </button>
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;
