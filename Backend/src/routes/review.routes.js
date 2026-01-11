import express from 'express';
import { protect, optionalAuth } from '../middlewares/auth.middleware.js';
import {
  getReviews,
  createReview,
  updateReview,
  deleteReview,
  getProductReviews
} from '../controllers/review.controller.js';

const router = express.Router();

// Public routes
router.get('/product/:productId', getProductReviews);

// Protected routes
router.use(protect);

router.get('/', getReviews);
router.post('/', createReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

export default router;

