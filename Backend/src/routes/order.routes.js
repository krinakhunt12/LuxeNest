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

router.post('/', createOrderValidator, validate, createOrder);
router.get('/', getOrders);
router.get('/:id', getOrder);
router.patch('/:id/cancel', cancelOrder);
router.patch('/:id/status', updateOrderStatusValidator, validate, updateOrderStatus);

export default router;

