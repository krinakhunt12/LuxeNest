import Product from '../models/Product.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadMultipleToCloudinary } from '../middlewares/upload.middleware.js';
import { getCachedData, cacheData, deleteCache } from '../config/redis.js';

export const getProducts = asyncHandler(async (req, res) => {
  const { category, search, sort, isNew, isSale, isBestSeller, limit = 12, page = 1 } = req.query;
  const query = { isActive: true };

  if (category) {
    query.category = category;
  }

  if (isNew === 'true') query.isNew = true;
  if (isSale === 'true') query.isSale = true;
  if (isBestSeller === 'true') query.isBestSeller = true;

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const sortOptions = {};
  if (sort === 'newest') sortOptions.createdAt = -1;
  else if (sort === 'price-low') sortOptions.price = 1;
  else if (sort === 'price-high') sortOptions.price = -1;
  else sortOptions.createdAt = -1;

  const products = await Product.find(query)
    .populate('category')
    .sort(sortOptions)
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Product.countDocuments(query);

  res.json({
    success: true,
    data: products,
    pagination: {
      total,
      page: page * 1,
      pages: Math.ceil(total / limit)
    }
  });
});

import mongoose from 'mongoose';

// Helper to construct query for ID (supports both _id and custom id)
const getQuery = (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return { $or: [{ _id: id }, { id: id }] };
  }
  return { id: id };
};

export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne(getQuery(req.params.id)).populate('category');
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, data: product });
});

export const createProduct = asyncHandler(async (req, res) => {
  const productData = req.body;

  // Handle image uploads if files are present
  if (req.files && req.files.length > 0) {
    const uploadResults = await uploadMultipleToCloudinary(req.files, 'products');
    productData.images = uploadResults.map((result, index) => ({
      url: result.secure_url,
      alt: productData.name,
      isPrimary: index === 0
    }));
  }

  // Generate a random ID if not provided (for frontend compatibility if needed)
  if (!productData.id) {
    productData.id = `PRD-${Date.now()}`;
  }

  const product = await Product.create(productData);

  // Clear cache if needed
  try {
    await deleteCache('products:*');
  } catch (error) {
    // Ignore cache clear errors
  }

  res.status(201).json({
    success: true,
    data: product
  });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const productData = req.body;
  const productId = req.params.id;

  // Handle new image uploads if files are present
  if (req.files && req.files.length > 0) {
    const uploadResults = await uploadMultipleToCloudinary(req.files, 'products');
    const newImages = uploadResults.map((result, index) => ({
      url: result.secure_url,
      alt: productData.name,
      isPrimary: false
    }));

    let finalImages = newImages;

    if (req.body.existingImages) {
      // existingImages is already parsed by parseFormDataJSON middleware
      if (Array.isArray(req.body.existingImages)) {
        finalImages = [...req.body.existingImages, ...newImages];
      }
    }

    productData.images = finalImages;
  }

  const product = await Product.findOneAndUpdate(getQuery(productId), productData, {
    new: true,
    runValidators: true
  });

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }

  // Clear cache
  try {
    await deleteCache('products:*');
    await deleteCache(`product:${productId}`);
  } catch (error) {
    // Ignore cache clear errors
  }

  res.json({
    success: true,
    data: product
  });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOneAndDelete(getQuery(req.params.id));
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, message: 'Product deleted' });
});

export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true, isActive: true })
    .limit(10)
    .sort({ createdAt: -1 });
  res.json({ success: true, data: products });
});

export const getNewArrivals = asyncHandler(async (req, res) => {
  const products = await Product.find({ isNew: true, isActive: true })
    .limit(10)
    .sort({ createdAt: -1 });
  res.json({ success: true, data: products });
});

export const getBestSellers = asyncHandler(async (req, res) => {
  const products = await Product.find({ isBestSeller: true, isActive: true })
    .limit(10)
    .sort({ salesCount: -1 });
  res.json({ success: true, data: products });
});

import * as XLSX from 'xlsx';

export const uploadExcel = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload an Excel file' });
  }

  const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet);

  if (!data || data.length === 0) {
    return res.status(400).json({ success: false, message: 'Excel file is empty' });
  }

  const productsToInsert = [];
  const errors = [];

  // Import Category model for lookup
  const Category = (await import('../models/Category.model.js')).default;

  for (let i = 0; i < data.length; i++) {
    const row = data[i];

    try {
      // Validate required fields
      const name = row.name || row.Name;
      const price = parseFloat(row.price || row.Price || 0);

      if (!name || !price) {
        errors.push(`Row ${i + 2}: Missing required fields (name or price)`);
        continue;
      }

      // Look up category by name (case-insensitive)
      let categoryId = null;
      const categoryName = row.category || row.Category;

      if (categoryName) {
        const category = await Category.findOne({
          name: { $regex: new RegExp(`^${categoryName}$`, 'i') }
        });

        if (category) {
          categoryId = category._id;
        } else {
          errors.push(`Row ${i + 2}: Category "${categoryName}" not found`);
          continue;
        }
      } else {
        errors.push(`Row ${i + 2}: Category is required`);
        continue;
      }

      // Build product object
      const product = {
        id: `PRD-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        name: name,
        slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '') + `-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        price: price,
        description: row.description || row.Description || '',
        category: categoryId,
        stock: parseInt(row.stock || row.Stock || 0),
        sku: row.sku || row.SKU || `LXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`
      };

      // Handle image URL from Excel
      const imageUrl = row.image || row.Image;
      if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim()) {
        product.images = [{
          url: imageUrl.trim(),
          alt: name,
          isPrimary: true
        }];
      }

      productsToInsert.push(product);
    } catch (error) {
      errors.push(`Row ${i + 2}: ${error.message}`);
    }
  }

  if (productsToInsert.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'No valid products to upload',
      errors: errors
    });
  }

  try {
    // Using insertMany with ordered: false to continue inserting other valid documents even if one fails
    const result = await Product.insertMany(productsToInsert, { ordered: false });

    // Clear cache
    await deleteCache('products:*');

    res.status(201).json({
      success: true,
      message: `${result.length} products uploaded successfully${errors.length > 0 ? ` (${errors.length} rows skipped)` : ''}`,
      data: result,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    // If some succeeded and some failed
    if (error.code === 11000) {
      // partial success maybe?
      return res.status(400).json({ success: false, message: 'Duplicate key error (e.g. SKU or ID already exists). Check your data.', error: error.message });
    }
    throw error;
  }
});

