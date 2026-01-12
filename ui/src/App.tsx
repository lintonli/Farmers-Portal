import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Register from './components/Register';
import Login from './components/Login';
import FarmerDashboard from './components/FarmerDashboard';
import AdminDashboard from './components/AdminDashboard';
import { getUserFromToken } from './Services/api';

function App() {
  const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactElement; requiredRole?: string }) => {
    const user = getUserFromToken();
    
    if (!user) {
      return <Navigate to="/login" />;
    }
    
    if (requiredRole && user.role !== requiredRole) {
      return <Navigate to="/login" />;
    }
    
    return children;
  };

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/farmer/dashboard" 
          element={
            <ProtectedRoute requiredRole="farmer">
              <FarmerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
