import User from '../models/User.model.js';
import Product from '../models/Product.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.json({ success: true, data: user.wishlist });
});

export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const user = await User.findById(req.user._id);
  
  if (user.wishlist.includes(productId)) {
    return res.status(400).json({ success: false, message: 'Product already in wishlist' });
  }
  
  user.wishlist.push(productId);
  await user.save();
  await user.populate('wishlist');
  
  res.json({ success: true, data: user.wishlist });
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const user = await User.findById(req.user._id);
  user.wishlist.pull(productId);
  await user.save();
  res.json({ success: true, message: 'Removed from wishlist' });
});

export const moveToCart = asyncHandler(async (req, res) => {
  // Implementation to move item from wishlist to cart
  res.json({ success: true, message: 'Move to cart - to be implemented' });
});

