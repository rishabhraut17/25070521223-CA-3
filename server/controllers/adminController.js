const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get dashboard statistics for admin
// @route   GET /api/admin/stats
// @access  Private (Admin only)
const getStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();

    // Total revenue from all non-cancelled orders
    const revenueResult = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Status breakdown
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Category breakdown
    const productsByCategory = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Low stock items (stock < 5)
    const lowStockProducts = await Product.find({ stock: { $lt: 5 } })
      .select('name stock price category')
      .limit(5);

    // Recent 5 orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email');

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue,
        totalProducts,
        totalUsers,
        ordersByStatus,
        productsByCategory,
        lowStockProducts,
        recentOrders
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats
};
