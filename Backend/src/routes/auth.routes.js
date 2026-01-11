import express from 'express';
import {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe,
  logout,
  adminRegister,
  adminLogin
} from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator
} from '../validators/auth.validator.js';

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               phone: { type: string }
 *     responses:
 *       201:
 *         description: User registered successfully
 */
router.post('/register', registerValidator, validate, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', loginValidator, validate, login);

router.post('/admin/register', registerValidator, validate, adminRegister);
router.post('/admin/login', loginValidator, validate, adminLogin);
router.get('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPasswordValidator, validate, forgotPassword);
router.post('/reset-password', resetPasswordValidator, validate, resetPassword);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

export default router;

