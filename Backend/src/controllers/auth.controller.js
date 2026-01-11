import User from '../models/User.model.js';
import { generateToken, generateRefreshToken } from '../utils/generateToken.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/emailService.js';
import crypto from 'crypto';
import { asyncHandler } from '../utils/asyncHandler.js';
import { logger } from '../utils/logger.js';

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email'
    });
  }

  // Generate verification token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const verificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  // Create user
  const user = await User.create({
    name,
    email,
    phone,
    password,
    emailVerificationToken: verificationToken,
    emailVerificationExpire: verificationExpire
  });

  // Send verification email
  await sendVerificationEmail(email, verificationToken);

  // Generate tokens
  const token = generateToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  // Save refresh token
  user.refreshToken = refreshToken;
  await user.save();

  res.status(201).json({
    success: true,
    message: 'Registration successful. Please verify your email.',
    data: {
      user,
      token,
      refreshToken
    }
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Find user and include password
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  if (!user.isActive) {
    return res.status(401).json({
      success: false,
      message: 'Account is deactivated'
    });
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate tokens
  const token = generateToken(user._id, user.role);
  const refreshToken = generateRefreshToken(user._id);

  // Save refresh token
  user.refreshToken = refreshToken;
  await user.save();

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user,
      token,
      refreshToken
    }
  });
});

/**
 * @desc    Verify email
 * @route   GET /api/auth/verify-email
 * @access  Public
 */
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;

  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired verification token'
    });
  }

  user.emailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpire = undefined;
  await user.save();

  res.json({
    success: true,
    message: 'Email verified successfully'
  });
});

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    // Don't reveal if user exists
    return res.json({
      success: true,
      message: 'If email exists, password reset link has been sent'
    });
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetToken = resetToken;
  user.passwordResetExpire = Date.now() + 60 * 60 * 1000; // 1 hour
  await user.save();

  // Send reset email
  await sendPasswordResetEmail(email, resetToken);

  res.json({
    success: true,
    message: 'Password reset email sent'
  });
});

/**
 * @desc    Reset password
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpire: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired reset token'
    });
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;
  await user.save();

  res.json({
    success: true,
    message: 'Password reset successful'
  });
});

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.json({
    success: true,
    data: user
  });
});

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
/**
 * @desc    Admin Register
 * @route   POST /api/auth/admin/register
 * @access  Public (or with Secret Key)
 */
export const adminRegister = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }

  const user = await User.create({
    name,
    email,
    phone,
    password,
    role: 'ADMIN', // Directly set as ADMIN for this specific API
    emailVerified: true // Auto-verify for admin setup
  });

  const token = generateToken(user._id, user.role);

  res.status(201).json({
    success: true,
    message: 'Admin account created successfully',
    data: { user, token }
  });
});

/**
 * @desc    Admin Login
 * @route   POST /api/auth/admin/login
 * @access  Public
 */
export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
  }

  if (user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. You do not have administrator privileges.'
    });
  }

  const token = generateToken(user._id, user.role);

  res.json({
    success: true,
    message: 'Admin login successful',
    data: { user, token }
  });
});

export const logout = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.refreshToken = undefined;
  await user.save();

  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

