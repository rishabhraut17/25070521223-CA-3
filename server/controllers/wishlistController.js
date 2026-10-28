const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get user wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.status(200).json({
      success: true,
      wishlist: user.wishlist || []
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const user = await User.findById(req.user._id);

    // If not already in wishlist, add it
    const isAlreadyInWishlist = user.wishlist.some(
      id => id.toString() === productId
    );

    if (!isAlreadyInWishlist) {
      user.wishlist.push(productId);
      await user.save();
    }

    const updatedUser = await User.findById(req.user._id).populate('wishlist');

    res.status(200).json({
      success: true,
      message: 'Product added to wishlist',
      wishlist: updatedUser.wishlist
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();

    const updatedUser = await User.findById(req.user._id).populate('wishlist');

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
      wishlist: updatedUser.wishlist
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist
};
