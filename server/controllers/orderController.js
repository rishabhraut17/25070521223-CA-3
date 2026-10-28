const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// @desc    Create new order (Checkout)
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod = 'Cash on Delivery' } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items provided for order'
      });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.phone) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all required shipping address fields'
      });
    }

    // Validate each item and check stock
    const snapshotItems = [];
    let calculatedTotal = 0;

    for (const item of items) {
      const productId = item.product?._id || item.product || item.productId;
      const product = await Product.findById(productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.name || productId}`
        });
      }

      const qty = Number(item.quantity) || 1;
      if (product.stock < qty) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${product.name}". Only ${product.stock} available.`
        });
      }

      // Snapshot values
      snapshotItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        size: item.size || 'M',
        colour: item.colour || 'Default',
        quantity: qty,
        image: (product.images && product.images[0]) || item.image || ''
      });

      calculatedTotal += product.price * qty;
    }

    // Atomically decrement stock for all items
    for (const item of snapshotItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity }
      });
    }

    // Create Order
    const order = await Order.create({
      user: req.user._id,
      items: snapshotItems,
      shippingAddress: {
        fullName: shippingAddress.fullName.trim(),
        phone: shippingAddress.phone.trim(),
        street: shippingAddress.street.trim(),
        city: shippingAddress.city.trim(),
        state: (shippingAddress.state || '').trim(),
        postalCode: shippingAddress.postalCode.trim()
      },
      paymentMethod,
      totalAmount: calculatedTotal,
      status: 'Placed'
    });

    // Clear cart upon successful order
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully with Cash on Delivery',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user's orders
// @route   GET /api/orders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.product', 'name slug images category');

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Ensure user owns this order OR is admin
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order (if Placed or Processing)
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Authorization
    if (
      order.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    if (order.status === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This order is already cancelled'
      });
    }

    if (order.status === 'Shipped' || order.status === 'Delivered') {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel an order that is already ${order.status.toLowerCase()}`
      });
    }

    // Restore stock back to products
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity }
      });
    }

    order.status = 'Cancelled';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order has been cancelled and inventory restored',
      order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/admin/all
// @access  Private (Admin only)
const getAllOrdersAdmin = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate('user', 'name email phone');

    res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private (Admin only)
const updateOrderStatusAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ['Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    if (!status || !allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${allowed.join(', ')}`
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // If changing to Cancelled from another status, restore stock
    if (status === 'Cancelled' && order.status !== 'Cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity }
        });
      }
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrdersAdmin,
  updateOrderStatusAdmin
};
