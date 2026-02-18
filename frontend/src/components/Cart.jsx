// src/components/Cart.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Cart() {
  const [cart, setCart] = useState({ products: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axios.get('/cart');
      // Handle the response structure properly
      if (response.data.success) {
        setCart(response.data.cart);
      } else {
        setCart(response.data);
      } 
    } catch (err) {
      console.error('Failed to fetch cart:', err);
      alert('Failed to fetch cart');
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    setLoading(true);
    try {
      // FIXED: Send productId (not id) to match backend expectation
      const response = await axios.put('/cart/update', { 
        productId: productId,  // Changed from 'id' to 'productId'
        quantity: newQuantity 
      });
      
      if (response.data.success) {
        setCart(response.data.cart);
        alert('Cart updated!');
      }
    } catch (err) {
      console.error('Failed to update cart:', err);
      alert('Failed to update cart');
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId) => {
    if (!window.confirm('Remove this item from cart?')) return;
    
    setLoading(true);
    try {
      const response = await axios.delete(`/cart/remove/${productId}`);
      if (response.data.success) {
        setCart(response.data.cart);
        alert('Item removed!');
      }
    } catch (err) {
      console.error('Failed to remove item:', err);
      alert('Failed to remove item');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (userId) => {
    setLoading(true);
    try{
      const response = await axios.delete('/cart/clear/', { userId: userId});
      if (response.data.success){
        alert('Checkout successful!');
        fetchCart();
      }
    }catch(err){
      console.error('Failed to checkout:', err);
      alert('Failed to checkout');
    }
  }

  const total = cart.products.reduce((sum, item) => {
    return sum + (item.productId?.price || 0) * item.quantity;
  }, 0);

  const userId = cart.userId;

  return (
    <div>
      <h2 style={{ color: 'white', marginBottom: '20px' }}>Your Cart</h2>
      
      <div className="card">
        {cart.products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h3>Your cart is empty</h3>
            <p style={{ color: '#666', marginTop: '10px' }}>
              Start shopping to add items to your cart!
            </p>
          </div>
        ) : (
          <>
            {cart.products.map((item) => {
              const productId = item.productId?._id || item._id;
              return (
                <div key={productId} className="cart-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img 
                      src={item.productId?.image || 'https://via.placeholder.com/50'} 
                      alt={item.productId?.name}
                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                    />
                    <div>
                      <h3 style={{ margin: '0' }}>{item.productId?.name || 'Product'}</h3>
                      <p style={{ color: '#666', margin: '5px 0 0 0' }}>
                        ₹{item.productId?.price || 0} each
                      </p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <button 
                        onClick={() => updateQuantity(productId, item.quantity - 1)}
                        disabled={loading || item.quantity <= 1}
                        style={{ 
                          height: '30px', 
                          width: '30px', 
                          backgroundColor: item.quantity <= 1 ? '#ccc' : '#e91d1d', 
                          border: 'none', 
                          borderRadius: '5px', 
                          color: 'white',
                          cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                          fontSize: '18px',
                          fontWeight: 'bold'
                        }}
                      >
                        -
                      </button>
                      
                      <span style={{ minWidth: '30px', textAlign: 'center', fontSize: '16px' }}>
                        {item.quantity}
                      </span>
                      
                      <button 
                        onClick={() => updateQuantity(productId, item.quantity + 1)}
                        disabled={loading}
                        style={{ 
                          height: '30px', 
                          width: '30px', 
                          backgroundColor: '#0b7b21', 
                          border: 'none', 
                          borderRadius: '5px', 
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '18px',
                          fontWeight: 'bold'
                        }}
                      >
                        +
                      </button>
                    </div>
                    
                    <p style={{ fontSize: '18px', fontWeight: 'bold', minWidth: '80px', textAlign: 'right' }}>
                      ₹{((item.productId?.price || 0) * item.quantity).toFixed(2)}
                    </p>
                    
                    <button 
                      onClick={() => removeItem(productId)}
                      disabled={loading}
                      style={{ 
                        padding: '5px 10px',
                        border: 'none',
                        background: '#dc3545',
                        color: 'white',
                        cursor: 'pointer',
                        borderRadius: '3px',
                        fontSize: '14px'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
            
            <div style={{ 
              marginTop: '20px', 
              padding: '20px', 
              background: '#f8f9fa', 
              borderRadius: '5px',
              borderTop: '2px solid #dee2e6'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: '0' }}>Total:</h3>
                <h3 style={{ color: '#667eea', margin: '0' }}>₹{total.toFixed(2)}</h3>
              </div>
              
              <button 
                className="btn" 
                style={{ marginTop: '20px', width: '100%' }}
                onClick={() => handleCheckout(userId)}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Cart;