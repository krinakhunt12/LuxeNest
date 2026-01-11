import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  moveToCart
} from '../controllers/wishlist.controller.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/', getWishlist);
router.post('/add/:productId', addToWishlist);
router.delete('/remove/:productId', removeFromWishlist);
router.post('/move-to-cart/:productId', moveToCart);

export default router;

