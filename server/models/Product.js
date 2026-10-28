const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: 150
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['Men', 'Women', 'Kids', 'Accessories'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price must be positive']
  },
  sizes: [{
    type: String,
    trim: true
  }],
  colours: [{
    type: String,
    trim: true
  }],
  stock: {
    type: Number,
    required: [true, 'Product stock quantity is required'],
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  images: [{
    type: String,
    trim: true
  }],
  featured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Auto-generate slug before saving
productSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);
  }
  next();
});

productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, price: 1, createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);
