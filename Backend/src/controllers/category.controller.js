import Category from '../models/Category.model.js';
import Product from '../models/Product.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadToCloudinary } from '../middlewares/upload.middleware.js';

export const getCategories = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  const total = await Category.countDocuments();
  const categories = await Category.find()
    .sort({ displayOrder: 1 })
    .skip(skip)
    .limit(parseInt(limit))
    .lean();

  // Get product counts for these categories
  const categoryIds = categories.map(c => c._id);
  const counts = await Product.aggregate([
    { $match: { category: { $in: categoryIds }, isActive: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } }
  ]);

  // Create a map for easy lookup
  const countMap = counts.reduce((acc, curr) => {
    acc[curr._id?.toString()] = curr.count;
    return acc;
  }, {});

  // Add counts to category objects
  const categoriesWithCount = categories.map(cat => ({
    ...cat,
    count: countMap[cat._id.toString()] || 0
  }));

  res.json({
    success: true,
    data: categoriesWithCount,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      limit: parseInt(limit)
    }
  });
});



export const getCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ success: false, message: 'Category not found' });
  }
  res.json({ success: true, data: category });
});

export const createCategory = asyncHandler(async (req, res) => {
  const categoryData = req.body;

  if (req.file) {
    const result = await uploadToCloudinary(req.file, 'categories');
    categoryData.image = result.secure_url;
  }

  const category = await Category.create(categoryData);
  res.status(201).json({ success: true, data: category });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const categoryData = req.body;

  if (req.file) {
    const result = await uploadToCloudinary(req.file, 'categories');
    categoryData.image = result.secure_url;
  }

  const category = await Category.findByIdAndUpdate(req.params.id, categoryData, { new: true });
  res.json({ success: true, data: category });
});


export const deleteCategory = asyncHandler(async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Category deleted' });
});

