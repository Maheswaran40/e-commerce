// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login';
import Register from './components/Register';
import User from './components/User';
import Cart from './components/Cart';

axios.defaults.baseURL = 'http://localhost:5000';

axios.interceptors.response.use(
  (response) => {
    // Transform the response to match the expected format
    if (response.config.url.includes('/products') && response.config.method === 'get') {
      if (response.data.success) {
        // Extract products array and return it as the response data
        response.data = response.data.products;
      }
    }
    if (response.config.url.includes('/cart') && response.config.method === 'get') {
      if (response.data.success) {
        response.data = response.data.cart;
      }
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function App() {
  const [user, setUser] = useState(null);
  const [allProducts, setAllProducts] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');
    if (token) {
      setUser({ token, role, name });
      axios.defaults.headers.common['Authorization'] = token;
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('role', userData.role);
    localStorage.setItem('name', userData.name);
    axios.defaults.headers.common['Authorization'] = userData.token;
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <Router>
      <div className="container">
        <nav className="navbar">
          <h2>🛒 E-Shop</h2>
          <div>
            {user ? (
              <>
                <span>Welcome, {user.name}</span>
                <Link to={user.role === 'admin' ? '/admin' : '/'}>Home</Link>
                {user.role === 'user' && <Link to="/cart">Cart</Link>}
                <button onClick={handleLogout} className="btn" style={{ marginLeft: '20px', padding: '8px 20px' }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )}
          </div>
        </nav>

        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onLogin={handleLogin} />} />
          
          <Route path="/cart" element={
            user?.role === 'user' ? <Cart /> : <Navigate to="/login" />
          } />
          
          <Route path="/" element={
            user ? <User /> : <Navigate to="/login" />  
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;