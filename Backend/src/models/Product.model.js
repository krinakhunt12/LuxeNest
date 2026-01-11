import mongoose from 'mongoose';

const dimensionSchema = new mongoose.Schema({
  width: {
    type: String,
    required: true
  },
  height: {
    type: String,
    required: true
  },
  depth: {
    type: String,
    required: true
  }
}, { _id: false });

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  shortDescription: {
    type: String,
    maxlength: 200
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subCategory: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  oldPrice: {
    type: Number,
    min: [0, 'Price cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  sku: {
    type: String,
    unique: true,
    uppercase: true,
    trim: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  inStock: {
    type: Boolean,
    default: true
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  colors: [{
    type: String,
    trim: true
  }],
  materials: [{
    type: String,
    trim: true
  }],
  dimensions: dimensionSchema,
  weight: {
    type: String,
    trim: true
  },
  finishType: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  warranty: {
    type: String,
    trim: true
  },
  shippingTime: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  isNew: {
    type: Boolean,
    default: false
  },
  isSale: {
    type: Boolean,
    default: false
  },
  isBestSeller: {
    type: Boolean,
    default: false
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  // SEO fields
  metaTitle: String,
  metaDescription: String,
  metaKeywords: [String],
  // Analytics
  views: {
    type: Number,
    default: 0
  },
  salesCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  suppressReservedKeysWarning: true
});

// Generate slug before saving
productSchema.pre('save', function (next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
  }

  // Calculate discount if oldPrice exists
  if (this.oldPrice && this.oldPrice > this.price) {
    this.discount = Math.round(((this.oldPrice - this.price) / this.oldPrice) * 100);
  }

  // Auto-generate SKU if not provided
  if (!this.sku) {
    this.sku = `LXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  next();
});

// Indexes for search and filtering
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ isActive: 1, isFeatured: 1 });
productSchema.index({ createdAt: -1 });

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function () {
  if (this.oldPrice && this.oldPrice > this.price) {
    return Math.round(((this.oldPrice - this.price) / this.oldPrice) * 100);
  }
  return 0;
});

const Product = mongoose.model('Product', productSchema);

export default Product;

