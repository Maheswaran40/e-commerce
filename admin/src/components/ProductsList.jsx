// admin/src/components/ProductsList.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProductsList({ refreshTrigger }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', price: '', description: '', image: '' });

  useEffect(() => {
    fetchProducts();
  }, [refreshTrigger]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/products');
      
      if (response.data.success) {
        setProducts(response.data.products || []);
      } else {
        setProducts(Array.isArray(response.data) ? response.data : []);
      }
      
      setError('');
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    try {
      await axios.delete(`/products/${productId}`);
      fetchProducts(); // Refresh list
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product._id);
    setEditForm({
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image || ''
    });
  };

  const handleUpdate = async (productId) => {
    try {
      await axios.put(`/products/${productId}`, editForm);
      setEditingProduct(null);
      fetchProducts(); // Refresh list
    } catch (err) {
      alert('Failed to update product');
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setEditForm({ name: '', price: '', description: '', image: '' });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', color: 'white', padding: '50px' }}>
        <h3>Loading products...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', color: 'white', padding: '50px' }}>
        <h3 style={{ color: '#e74c3c' }}>{error}</h3>
        <button onClick={fetchProducts} className="btn" style={{ marginTop: '20px' }}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ color: 'white', marginBottom: '20px' }}>
        Manage Products ({products.length})
      </h2>
      
      {products.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h3>No products available</h3>
          <p style={{ color: '#666', marginTop: '10px' }}>
            Add your first product using the form above!
          </p>
        </div>
      ) : (
        <div className="admin-table">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td>
                    <img 
                      src={product.image || 'https://via.placeholder.com/50'} 
                      alt={product.name}
                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                    />
                  </td>
                  <td>
                    {editingProduct === product._id ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        style={{ padding: '5px', width: '100%' }}
                      />
                    ) : (
                      product.name
                    )}
                  </td>
                  <td>
                    {editingProduct === product._id ? (
                      <input
                        type="number"
                        value={editForm.price}
                        onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                        style={{ padding: '5px', width: '100px' }}
                      />
                    ) : (
                      `$${product.price}`
                    )}
                  </td>
                  <td>
                    {editingProduct === product._id ? (
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        style={{ padding: '5px', width: '100%' }}
                        rows="2"
                      />
                    ) : (
                      product.description
                    )}
                  </td>
                  <td>
                    {editingProduct === product._id ? (
                      <div className="action-btns">
                        <button 
                          onClick={() => handleUpdate(product._id)}
                          className="btn-success"
                        >
                          Save
                        </button>
                        <button 
                          onClick={cancelEdit}
                          className="btn-danger"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="action-btns">
                        <button 
                          onClick={() => handleEdit(product)}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProductsList;