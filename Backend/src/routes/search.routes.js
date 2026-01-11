import express from 'express';
import { optionalAuth } from '../middlewares/auth.middleware.js';
import {
  searchProducts,
  getSearchSuggestions,
  getTrendingSearches
} from '../controllers/search.controller.js';

const router = express.Router();

/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Search products
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/', optionalAuth, searchProducts);

/**
 * @swagger
 * /api/search/suggestions:
 *   get:
 *     summary: Get search suggestions
 *     tags: [Search]
 *     responses:
 *       200:
 *         description: List of suggestions
 */
router.get('/suggestions', getSearchSuggestions);

router.get('/trending', getTrendingSearches);


export default router;

