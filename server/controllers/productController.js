const Product = require('../models/Product');

// @desc    Get all products with search, filter, sort, and pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      size,
      colour,
      minPrice,
      maxPrice,
      sort,
      featured,
      page = 1,
      limit = 12
    } = req.query;

    const query = {};

    // Search query
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Size filter
    if (size) {
      query.sizes = { $in: Array.isArray(size) ? size : [size] };
    }

    // Colour filter
    if (colour) {
      query.colours = { $in: Array.isArray(colour) ? colour : [colour] };
    }

    // Price range
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined && minPrice !== '') query.price.$gte = Number(minPrice);
      if (maxPrice !== undefined && maxPrice !== '') query.price.$lte = Number(maxPrice);
      if (Object.keys(query.price).length === 0) delete query.price;
    }

    // Featured filter
    if (featured === 'true') {
      query.featured = true;
    }

    // Sorting
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'price-asc') {
      sortOptions = { price: 1 };
    } else if (sort === 'price-desc') {
      sortOptions = { price: -1 };
    } else if (sort === 'name-asc') {
      sortOptions = { name: 1 };
    } else if (sort === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sort === 'popularity') {
      sortOptions = { featured: -1, createdAt: -1 };
    }

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
      currentPage: pageNum,
      products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID or slug
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product;

    // Check if id is valid Mongo ObjectId or slug
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id);
    } else {
      product = await Product.findOne({ slug: id });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Find related products in same category
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    }).limit(4);

    res.status(200).json({
      success: true,
      product,
      related
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Admin only)
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      category,
      price,
      sizes,
      colours,
      stock,
      images,
      featured
    } = req.body;

    if (!name || !description || !category || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, description, category, and price'
      });
    }

    const product = await Product.create({
      name,
      description,
      category,
      price: Number(price),
      sizes: Array.isArray(sizes) ? sizes : (sizes ? sizes.split(',').map(s => s.trim()) : ['S', 'M', 'L']),
      colours: Array.isArray(colours) ? colours : (colours ? colours.split(',').map(c => c.trim()) : ['Black', 'White']),
      stock: stock !== undefined ? Number(stock) : 10,
      images: Array.isArray(images) && images.length > 0 ? images : [
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80'
      ],
      featured: Boolean(featured)
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin only)
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const updateData = { ...req.body };
    if (updateData.price !== undefined) updateData.price = Number(updateData.price);
    if (updateData.stock !== undefined) updateData.stock = Number(updateData.stock);
    if (typeof updateData.sizes === 'string') {
      updateData.sizes = updateData.sizes.split(',').map(s => s.trim());
    }
    if (typeof updateData.colours === 'string') {
      updateData.colours = updateData.colours.split(',').map(c => c.trim());
    }

    product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin only)
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await Product.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
