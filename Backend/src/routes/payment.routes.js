import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import {
  createPayment,
  verifyPayment,
  getPaymentStatus
} from '../controllers/payment.controller.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.post('/create', createPayment);
router.post('/verify', verifyPayment);
router.get('/:orderId/status', getPaymentStatus);

export default router;

