// admin/src/components/AdminLogin.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminLogin({ onLogin }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('/auth/login', formData);
      
      if (response.data.role === 'admin') {
        onLogin(response.data);
        navigate('/');
      } else {
        setError('Access denied. Admin credentials required.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2 style={{ marginBottom: '20px', color: '#2c3e50' }}>Admin Login</h2>
      
      {error && (
        <p style={{ 
          color: '#e74c3c', 
          marginBottom: '15px',
          padding: '10px',
          backgroundColor: '#fde8e8',
          borderRadius: '5px',
          textAlign: 'center'
        }}>
          {error}
        </p>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            disabled={loading}
          />
        </div>
        <button 
          type="submit" 
          className="btn" 
          disabled={loading}
          style={{ 
            width: '100%',
            opacity: loading ? 0.7 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Logging in...' : 'Login as Admin'}
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: '20px', color: '#7f8c8d' }}>
        Use email: admin@admin.com
      </p>
    </div>
  );
}

export default AdminLogin;