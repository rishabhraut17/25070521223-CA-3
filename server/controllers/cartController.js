const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper to get or create cart
const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.product');
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user._id);

    // Calculate subtotal
    let subtotal = 0;
    cart.items.forEach(item => {
      if (item.product && item.product.price) {
        subtotal += item.product.price * item.quantity;
      }
    });

    res.status(200).json({
      success: true,
      cart,
      subtotal
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const { productId, size, colour, quantity = 1 } = req.body;

    if (!productId || !size || !colour) {
      return res.status(400).json({
        success: false,
        message: 'Please provide productId, size, and colour'
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items remaining in stock`
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Check if the exact product + size + colour combination already exists
    const existingIndex = cart.items.findIndex(
      item =>
        item.product.toString() === productId &&
        item.size.toLowerCase() === size.toLowerCase() &&
        item.colour.toLowerCase() === colour.toLowerCase()
    );

    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].quantity + Number(quantity);
      if (newQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Cannot add more than available stock (${product.stock})`
        });
      }
      cart.items[existingIndex].quantity = newQty;
    } else {
      cart.items.push({
        product: productId,
        size,
        colour,
        quantity: Number(quantity)
      });
    }

    await cart.save();
    const updatedCart = await Cart.findById(cart._id).populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      cart: updatedCart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update quantity of a cart item
// @route   PUT /api/cart/:itemId
// @access  Private
const updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || Number(quantity) < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // Verify stock
    const product = await Product.findById(item.product);
    if (product && product.stock < Number(quantity)) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} items remaining in stock`
      });
    }

    item.quantity = Number(quantity);
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Cart item updated',
      cart: updatedCart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove an item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
const removeCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate('items.product');

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      cart: updatedCart
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      cart: { items: [] }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
};
