// admin/src/components/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductsList from './ProductsList';

function AdminDashboard() {
  const [product, setProduct] = useState({ name: '', price: '', description: '', image: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const response = await axios.post('/products', product);
      if (response.data.success) {
        setMessage({ type: 'success', text: '✅ Product added successfully!' });
        setProduct({ name: '', price: '', description: '', image: '' });
        setRefreshTrigger(prev => prev + 1); // Refresh products list
      }
    } catch (err) {
      setMessage({ type: 'error', text: '❌ Failed to add product' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div>
      <h2 style={{ color: 'white', marginBottom: '20px' }}>Add New Product</h2>
      
      {/* Add Product Form */}
      <div className="card" style={{ maxWidth: '600px', marginBottom: '40px' }}>
        {message && (
          <p style={{ 
            color: message.type === 'success' ? '#27ae60' : '#e74c3c', 
            marginBottom: '15px',
            padding: '10px',
            backgroundColor: message.type === 'success' ? '#e8f8e8' : '#fde8e8',
            borderRadius: '5px',
            textAlign: 'center'
          }}>
            {message.text}
          </p>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Product Name"
              value={product.name}
              onChange={(e) => setProduct({ ...product, name: e.target.value })}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              placeholder="Price"
              value={product.price}
              onChange={(e) => setProduct({ ...product, price: e.target.value })}
              required
              min="0"
              step="0.01"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <textarea
              placeholder="Description"
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
              required
              rows="3"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Image URL (optional)"
              value={product.image}
              onChange={(e) => setProduct({ ...product, image: e.target.value })}
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-success" 
            disabled={loading}
            style={{ 
              width: '100%',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Adding Product...' : '➕ Add Product'}
          </button>
        </form>
      </div>

      {/* Products List */}
      <ProductsList refreshTrigger={refreshTrigger} />
    </div>
  );
}

export default AdminDashboard;