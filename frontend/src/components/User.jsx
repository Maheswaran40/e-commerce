// src/components/User.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function User() {
  const [products, setProducts] = useState([]);
  const [cartMessage, setCartMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/products');
      
      // ✅ FIXED: Check the response structure and extract products properly
      if (response.data.success) {
        // New response format: { success: true, products: [...] }
        setProducts(response.data.products || []);
      } else {
        // Fallback for old format or direct array
        setProducts(Array.isArray(response.data) ? response.data : 
                   Array.isArray(response.data.products) ? response.data.products : []);
      }
      
      setError('');
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products. Please try again.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    try {
      const response = await axios.post('/cart/add', { productId, quantity: 1 });
      if (response.data.success) {
        setCartMessage('✅ Added to cart!');
      } else {
        setCartMessage('❌ Failed to add to cart');
      }
      setTimeout(() => setCartMessage(''), 2000);
    } catch (err) {
      console.error('Add to cart error:', err);
      setCartMessage('❌ Failed to add to cart');
      setTimeout(() => setCartMessage(''), 2000);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', color: 'white', padding: '50px' }}>
        <h2>Loading products...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', color: 'white', padding: '50px' }}>
        <h2 style={{ color: '#ff6b6b' }}>{error}</h2>
        <button onClick={fetchProducts} className="btn" style={{ marginTop: '20px' }}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ color: 'white', marginBottom: '20px' }}>Products</h2>
      {cartMessage && (
        <p style={{ 
          color: cartMessage.includes('✅') ? '#51cf66' : '#ff6b6b', 
          marginBottom: '15px',
          padding: '10px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: '5px',
          textAlign: 'center'
        }}>
          {cartMessage}
        </p>
      )}
      
      {products.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h3>No products available</h3>
          <p style={{ color: '#666', marginTop: '10px' }}>
            Check back later for new products!
          </p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map(product => (
            <div key={product._id} className="product-card">
              <img 
                src={product.image || 'https://via.placeholder.com/200'} 
                alt={product.name} 
                style={{ 
                  width: '100%', 
                  height: '200px', 
                  objectFit: 'cover', 
                  borderRadius: '8px 8px 0 0' 
                }} 
              />
              <div style={{ padding: '15px' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>{product.name}</h3>
                <p style={{ color: '#666', margin: '0 0 10px 0', fontSize: '14px' }}>
                  {product.description}
                </p>
                <p style={{ 
                  fontSize: '24px', 
                  color: '#667eea', 
                  fontWeight: 'bold',
                  margin: '10px 0'
                }}>
                  ₹{product.price}
                </p>
                <button 
                  onClick={() => addToCart(product._id)} 
                  className="btn" 
                  style={{ width: '100%' }}
                >
                  🛒 Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default User;