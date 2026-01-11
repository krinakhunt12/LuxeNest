import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
  uploadExcel
} from '../controllers/product.controller.js';
import { protect, restrictTo, optionalAuth } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import {
  createProductValidator,
  updateProductValidator,
  getProductsValidator
} from '../validators/product.validator.js';
import { upload } from '../middlewares/upload.middleware.js';
import { parseFormDataJSON } from '../middlewares/parseFormData.middleware.js';

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getProductsValidator, validate, getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/best-sellers', getBestSellers);
router.get('/:id', optionalAuth, getProduct);

// Protected routes (Admin only)
router.use(protect, restrictTo('ADMIN'));

router.post('/upload-excel', upload.single('file'), uploadExcel);
router.post('/', upload.array('images', 10), parseFormDataJSON, createProductValidator, validate, createProduct);
router.put('/:id', upload.array('images', 10), parseFormDataJSON, updateProductValidator, validate, updateProduct);
router.delete('/:id', deleteProduct);

export default router;

