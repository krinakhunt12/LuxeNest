import express from 'express';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';
import {
  getDashboardStats,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getOrders,
  getOrder,
  getProducts,
  getProduct,
  getAnalytics,
  updateOrderStatus,
  deleteProductsBulk
} from '../controllers/admin.controller.js';

const router = express.Router();

// All routes require admin access
router.use(protect, restrictTo('ADMIN'));

// Dashboard
router.get('/dashboard', getDashboardStats);
router.get('/analytics', getAnalytics);

// User management
router.get('/users', getUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Order management
router.get('/orders', getOrders);
router.get('/orders/:id', getOrder);
router.post('/orders/:id', updateOrderStatus);

// Product management (additional admin routes)
router.get('/products', getProducts);
router.post('/products/bulk-delete', deleteProductsBulk);
router.get('/products/:id', getProduct);

export default router;


