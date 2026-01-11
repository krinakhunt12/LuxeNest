import Cart from '../models/Cart.model.js';
import Product from '../models/Product.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }
  res.json({ success: true, data: cart });
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1, selectedColor } = req.body;
  
  const product = await Product.findById(productId);
  if (!product || !product.inStock) {
    return res.status(400).json({ success: false, message: 'Product not available' });
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  const existingItem = cart.items.find(
    item => item.product.toString() === productId && item.selectedColor === selectedColor
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
      selectedColor,
      price: product.price
    });
  }

  await cart.save();
  await cart.populate('items.product');
  
  res.json({ success: true, data: cart });
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  
  const cart = await Cart.findOne({ user: req.user._id });
  const item = cart.items.id(itemId);
  
  if (!item) {
    return res.status(404).json({ success: false, message: 'Item not found' });
  }
  
  item.quantity = quantity;
  await cart.save();
  await cart.populate('items.product');
  
  res.json({ success: true, data: cart });
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const cart = await Cart.findOne({ user: req.user._id });
  cart.items.pull(itemId);
  await cart.save();
  res.json({ success: true, data: cart });
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  cart.items = [];
  await cart.save();
  res.json({ success: true, message: 'Cart cleared' });
});

