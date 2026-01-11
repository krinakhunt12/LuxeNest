import Review from '../models/Review.model.js';
import Order from '../models/Order.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ 
    product: req.params.productId, 
    isApproved: true 
  })
    .populate('user', 'name')
    .sort({ createdAt: -1 });
  
  res.json({ success: true, data: reviews });
});

export const createReview = asyncHandler(async (req, res) => {
  const { product, rating, comment, title } = req.body;
  
  // Check if user already reviewed this product
  const existingReview = await Review.findOne({ 
    user: req.user._id, 
    product 
  });
  
  if (existingReview) {
    return res.status(400).json({ 
      success: false, 
      message: 'You have already reviewed this product' 
    });
  }
  
  // Check if user purchased the product (optional verification)
  const hasPurchased = await Order.findOne({
    user: req.user._id,
    'items.product': product,
    orderStatus: 'DELIVERED'
  });
  
  const review = await Review.create({
    user: req.user._id,
    product,
    rating,
    comment,
    title,
    isVerifiedPurchase: !!hasPurchased,
    isApproved: hasPurchased ? true : false // Auto-approve verified purchases
  });
  
  await review.populate('user', 'name');
  
  res.status(201).json({ success: true, data: review });
});

export const getReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ user: req.user._id })
    .populate('product', 'name')
    .sort({ createdAt: -1 });
  
  res.json({ success: true, data: reviews });
});

export const updateReview = asyncHandler(async (req, res) => {
  const review = await Review.findOne({ 
    _id: req.params.id, 
    user: req.user._id 
  });
  
  if (!review) {
    return res.status(404).json({ success: false, message: 'Review not found' });
  }
  
  Object.assign(review, req.body);
  review.isApproved = false; // Re-approve after update
  await review.save();
  
  res.json({ success: true, data: review });
});

export const deleteReview = asyncHandler(async (req, res) => {
  await Review.findOneAndDelete({ 
    _id: req.params.id, 
    user: req.user._id 
  });
  
  res.json({ success: true, message: 'Review deleted' });
});

