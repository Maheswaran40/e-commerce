// controllers/cartController.js
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user cart
// @route   GET /api/cart
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.userId })
      .populate('products.productId', 'name price image');
    
    if (!cart) {
      cart = await Cart.create({ userId: req.userId, products: [] });
    }
    
    res.json({
      success: true,
      cart
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch cart',
      error: error.message 
    });
  }
};

// @desc    Add to cart
// @route   POST /api/cart/add
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    let cart = await Cart.findOne({ userId: req.userId });
    
    if (!cart) {
      cart = new Cart({ userId: req.userId, products: [] });
    }
    
    const existingProductIndex = cart.products.findIndex(
      p => p.productId.toString() === productId
    );
    
    if (existingProductIndex > -1) {
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }
    
    await cart.save();
    
    // Populate product details
    await cart.populate('products.productId', 'name price image');
    
    res.json({
      success: true,
      cart
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to add to cart',
      error: error.message 
    });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    const productIndex = cart.products.findIndex(
      p => p.productId.toString() === productId
    );
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in cart'
      });
    }
    
    if (quantity <= 0) {
      cart.products.splice(productIndex, 1);
    } else {
      cart.products[productIndex].quantity = quantity;
    }
    
    await cart.save();
    await cart.populate('products.productId', 'name price image');
    
    res.json({
      success: true,
      cart
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to update cart',
      error: error.message 
    });
  }
};

// @desc    Remove from cart
// @route   DELETE /api/cart/remove/:productId
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const cart = await Cart.findOne({ userId: req.userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }
    
    cart.products = cart.products.filter(
      p => p.productId.toString() !== productId
    );
    
    await cart.save();
    await cart.populate('products.productId', 'name price image');
    
    res.json({
      success: true,
      cart
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to remove from cart',
      error: error.message 
    });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart/clear
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.userId });
    if (cart) {
      cart.products = [];
      await cart.save();
    }
    
    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to clear cart',
      error: error.message 
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};