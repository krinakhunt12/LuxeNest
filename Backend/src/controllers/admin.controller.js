import User from '../models/User.model.js';
import Product from '../models/Product.model.js';
import Order from '../models/Order.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({ role: 'USER' });
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalRevenueResult = await Order.aggregate([
    { $match: { paymentStatus: 'PAID' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]);

  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('user', 'name');

  const formattedRecentOrders = recentOrders.map(order => ({
    id: order._id || order.id,
    customer: order.user?.name || order.shippingAddress?.name || 'Guest',
    status: order.orderStatus,
    date: new Date(order.createdAt).toLocaleDateString(),
    amount: order.totalAmount
  }));

  res.set('Cache-Control', 'no-store');
  res.json({
    success: true,
    data: {
      totalCustomers: totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue: totalRevenueResult[0]?.total || 0,
      recentOrders: formattedRecentOrders
    }
  });
});


export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.set('Cache-Control', 'no-store');
  res.json({ success: true, data: users });
});

export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  res.json({ success: true, data: user });
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, data: user });
});

export const deleteUser = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'User deleted' });
});

export const getOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  let query = {};

  if (search) {
    if (search.match(/^[0-9a-fA-F]{24}$/)) {
      query._id = search;
    } else {
      // Search for users matching the name or email
      const users = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      }).select('_id');

      const userIds = users.map(u => u._id);
      query.user = { $in: userIds };
    }
  }

  const skip = (page - 1) * limit;
  const total = await Order.countDocuments(query);
  const orders = await Order.find(query)
    .populate('user', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));


  res.set('Cache-Control', 'no-store');
  res.json({
    success: true,
    data: orders,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      limit: parseInt(limit)
    }
  });
});


export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  res.json({ success: true, data: order });
});

export const getProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { sku: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (page - 1) * limit;
  const products = await Product.find(query)
    .populate('category')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Product.countDocuments(query);

  res.set('Cache-Control', 'no-store');
  res.json({
    success: true,
    data: products,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      limit: parseInt(limit)
    }
  });
});


export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category');
  res.json({ success: true, data: product });
});

export const getAnalytics = asyncHandler(async (req, res) => {
  // Implementation for analytics
  res.json({ success: true, message: 'Analytics - to be implemented' });
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

export const deleteProductsBulk = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids)) {
    return res.status(400).json({ success: false, message: 'Invalid product IDs' });
  }

  await Product.deleteMany({ _id: { $in: ids } });
  res.json({ success: true, message: `${ids.length} products deleted` });
});

