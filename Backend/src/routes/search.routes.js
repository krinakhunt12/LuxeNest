import express from 'express';
import { optionalAuth } from '../middlewares/auth.middleware.js';
import {
  searchProducts,
  getSearchSuggestions,
  getTrendingSearches
} from '../controllers/search.controller.js';

const router = express.Router();

// Public routes
router.get('/', optionalAuth, searchProducts);
router.get('/suggestions', getSearchSuggestions);
router.get('/trending', getTrendingSearches);

export default router;

