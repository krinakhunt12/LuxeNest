import mongoose from 'mongoose';
import Order from '../models/Order.model.js';
import Cart from '../models/Cart.model.js';
import Product from '../models/Product.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendOrderConfirmationEmail } from '../utils/emailService.js';

export const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  // Calculate totals
  let subtotal = 0;
  const processedItems = [];

  for (const item of items) {
    // Find product by MongoDB ID or our custom 'id' (p1, p7, etc.)
    const product = await Product.findOne({
      $or: [
        { _id: mongoose.isValidObjectId(item.product) ? item.product : null },
        { id: item.product }
      ]
    });

    if (product) {
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }
      subtotal += product.price * item.quantity;
      processedItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
        selectedColor: item.selectedColor,
        image: item.image || (product.images && product.images[0]?.url)
      });
    } else {
      // If product not found in DB, use data from request (for testing/demo)
      subtotal += (item.price || 0) * item.quantity;
      processedItems.push({
        product: item.product, // Could be 'p1', 'p7' etc.
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        selectedColor: item.selectedColor,
        image: item.image
      });
    }
  }

  const shippingCharges = subtotal > 1000 ? 0 : 100;
  const tax = subtotal * 0.18; // 18% GST
  const totalAmount = subtotal + shippingCharges + tax;

  const order = await Order.create({
    orderId: `LXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    user: req.user._id,
    items: processedItems,
    subtotal,
    shippingCharges,
    tax,
    totalAmount,
    shippingAddress,
    paymentMethod,
    paymentStatus: paymentMethod === 'COD' ? 'PENDING' : 'PENDING'
  });

  // Update product stock (only for items that exist in DB)
  for (const item of processedItems) {
    if (mongoose.isValidObjectId(item.product)) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, salesCount: item.quantity }
      });
    } else {
      // Try finding by custom id if not ObjectId
      await Product.findOneAndUpdate({ id: item.product }, {
        $inc: { stock: -item.quantity, salesCount: item.quantity }
      });
    }
  }

  // Clear cart
  await Cart.findOneAndUpdate(
    { user: req.user._id },
    { items: [] }
  );

  // Send confirmation email
  await sendOrderConfirmationEmail(req.user.email, {
    orderId: order.orderId,
    totalAmount: order.totalAmount
  });

  res.status(201).json({ success: true, data: order });
});

export const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 });
  res.json({ success: true, data: orders });
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  res.json({ success: true, data: order });
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user._id
  });

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  if (order.orderStatus === 'DELIVERED' || order.orderStatus === 'CANCELLED') {
    return res.status(400).json({
      success: false,
      message: 'Cannot cancel this order'
    });
  }

  order.orderStatus = 'CANCELLED';
  order.cancelledAt = new Date();
  await order.save();

  res.json({ success: true, data: order });
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found' });
  }

  // Update order status
  order.orderStatus = orderStatus;

  // Update delivery date if status is DELIVERED
  if (orderStatus === 'DELIVERED') {
    order.deliveredAt = new Date();
  }

  await order.save();

  res.json({ success: true, data: order });
});

