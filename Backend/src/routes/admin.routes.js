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

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats
 */
router.get('/dashboard', getDashboardStats);

router.get('/analytics', getAnalytics);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/users', getUsers);

router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

/**
 * @swagger
 * /api/admin/orders:
 *   get:
 *     summary: Get all orders (with pagination & search)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 */
router.get('/orders', getOrders);

router.get('/orders/:id', getOrder);

/**
 * @swagger
 * /api/admin/orders/{id}:
 *   post:
 *     summary: Update order status
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [orderStatus]
 *             properties:
 *               orderStatus: { type: string, enum: [PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED] }
 *     responses:
 *       200:
 *         description: Status updated
 */
router.post('/orders/:id', updateOrderStatus);

// Product management (additional admin routes)
router.get('/products', getProducts);
router.post('/products/bulk-delete', deleteProductsBulk);
router.get('/products/:id', getProduct);


export default router;


