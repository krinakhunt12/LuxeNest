import express from 'express';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/category.controller.js';
import { protect, restrictTo } from '../middlewares/auth.middleware.js';

import { upload } from '../middlewares/upload.middleware.js';
import { parseFormDataJSON } from '../middlewares/parseFormData.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get('/', getCategories);

router.get('/:id', getCategory);

// Protected routes (Admin only)
router.use(protect, restrictTo('ADMIN'));

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Category created
 */
router.post('/', upload.single('image'), parseFormDataJSON, createCategory);

router.put('/:id', upload.single('image'), parseFormDataJSON, updateCategory);
router.delete('/:id', deleteCategory);



export default router;

