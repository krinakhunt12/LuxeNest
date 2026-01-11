import Product from '../models/Product.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const searchProducts = asyncHandler(async (req, res) => {
  const { q, category, minPrice, maxPrice, material, color, sort } = req.query;
  
  let query = { isActive: true };
  
  // Text search
  if (q) {
    query.$text = { $search: q };
  }
  
  // Filters
  if (category) query.category = category;
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }
  if (material) query.materials = { $in: [material] };
  if (color) query.colors = { $in: [color] };
  
  // Sort
  let sortOption = {};
  switch (sort) {
    case 'price-low':
      sortOption = { price: 1 };
      break;
    case 'price-high':
      sortOption = { price: -1 };
      break;
    case 'rating':
      sortOption = { rating: -1 };
      break;
    case 'newest':
      sortOption = { createdAt: -1 };
      break;
    default:
      sortOption = q ? { score: { $meta: 'textScore' } } : { createdAt: -1 };
  }
  
  const products = await Product.find(query)
    .populate('category')
    .sort(sortOption)
    .limit(50);
  
  res.json({ success: true, data: products });
});

export const getSearchSuggestions = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) {
    return res.json({ success: true, data: [] });
  }
  
  const products = await Product.find({
    $text: { $search: q },
    isActive: true
  })
    .select('name slug')
    .limit(10);
  
  res.json({ success: true, data: products });
});

export const getTrendingSearches = asyncHandler(async (req, res) => {
  // Implementation for trending searches
  res.json({ success: true, data: [] });
});

