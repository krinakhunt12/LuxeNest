import nodemailer from 'nodemailer';
import { logger } from './logger.js';

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS || process.env.EMAIL_PASSWORD,
  },
});

/**
 * Send email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email HTML content
 * @param {string} options.text - Email text content
 */
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error(`Email send error: ${error.message}`);
    return { success: false, error: error.message };
  }
};

/**
 * Send verification email
 * @param {string} email - User email
 * @param {string} token - Verification token
 */
export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
  const html = `
    <h2>Welcome to LuxeNest!</h2>
    <p>Please verify your email address by clicking the link below:</p>
    <a href="${verificationUrl}">Verify Email</a>
    <p>Or copy this link: ${verificationUrl}</p>
    <p>This link will expire in 24 hours.</p>
  `;

  return await sendEmail({
    to: email,
    subject: 'Verify Your Email - LuxeNest',
    html,
    text: `Verify your email: ${verificationUrl}`,
  });
};

/**
 * Send password reset email
 * @param {string} email - User email
 * @param {string} token - Reset token
 */
export const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  const html = `
    <h2>Password Reset Request</h2>
    <p>You requested to reset your password. Click the link below:</p>
    <a href="${resetUrl}">Reset Password</a>
    <p>Or copy this link: ${resetUrl}</p>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  return await sendEmail({
    to: email,
    subject: 'Reset Your Password - LuxeNest',
    html,
    text: `Reset your password: ${resetUrl}`,
  });
};

/**
 * Send order confirmation email
 * @param {string} email - User email
 * @param {Object} order - Order details
 */
export const sendOrderConfirmationEmail = async (email, order) => {
  const html = `
    <h2>Order Confirmed!</h2>
    <p>Thank you for your order. Your order ID is: <strong>${order.orderId}</strong></p>
    <p>Total Amount: $${order.totalAmount}</p>
    <p>We'll send you tracking information once your order ships.</p>
  `;

  return await sendEmail({
    to: email,
    subject: `Order Confirmation - ${order.orderId}`,
    html,
    text: `Your order ${order.orderId} has been confirmed. Total: $${order.totalAmount}`,
  });
};

