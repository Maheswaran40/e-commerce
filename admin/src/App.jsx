import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

axios.defaults.baseURL = 'http://localhost:5000';

// Add token to all requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers['Authorization'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminRole');
      localStorage.removeItem('adminName');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

function App() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const role = localStorage.getItem('adminRole');
    const name = localStorage.getItem('adminName');
    
    if (token && role === 'admin') {
      setAdmin({ token, role, name });
    }
    setLoading(false);
  }, []);

  const handleLogin = (adminData) => {
    setAdmin(adminData);
    localStorage.setItem('adminToken', adminData.token);
    localStorage.setItem('adminRole', adminData.role);
    localStorage.setItem('adminName', adminData.name);
  };

  const handleLogout = () => {
    setAdmin(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRole');
    localStorage.removeItem('adminName');
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        color: 'white',
        fontSize: '20px'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <div className="container">
        <nav className="navbar">
          <h2>🛒 Admin Panel</h2>
          <div>
            {admin ? (
              <>
                <span>Welcome, {admin.name}</span>
                <button onClick={handleLogout} className="btn" style={{ marginLeft: '20px', padding: '8px 20px' }}>
                  Logout
                </button>
              </>
            ) : (
              <span>Admin Login</span>
            )}
          </div>
        </nav>

        <Routes>
          <Route path="/login" element={<AdminLogin onLogin={handleLogin} />} />
          <Route path="/" element={
            admin ? <AdminDashboard /> : <Navigate to="/login" />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;