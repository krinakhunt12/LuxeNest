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

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategory);

// Protected routes (Admin only)
router.use(protect, restrictTo('ADMIN'));

router.post('/', upload.single('image'), parseFormDataJSON, createCategory);
router.put('/:id', upload.single('image'), parseFormDataJSON, updateCategory);
router.delete('/:id', deleteCategory);


export default router;

