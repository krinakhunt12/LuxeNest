import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import {
  createOrder,
  getOrders,
  getOrder,
  cancelOrder,
  updateOrderStatus
} from '../controllers/order.controller.js';
import {
  createOrderValidator,
  updateOrderStatusValidator
} from '../validators/order.validator.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [items, shippingAddress, paymentMethod]
 *             properties:
 *               items: { type: array, items: { type: object } }
 *               shippingAddress: { type: object }
 *               paymentMethod: { type: string }
 *     responses:
 *       201:
 *         description: Order created
 */
router.post('/', createOrderValidator, validate, createOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all user orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 */
router.get('/', getOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order details by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Order details
 */
router.get('/:id', getOrder);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   patch:
 *     summary: Cancel an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Order cancelled
 */
router.patch('/:id/cancel', cancelOrder);

router.patch('/:id/status', updateOrderStatusValidator, validate, updateOrderStatus);


export default router;

