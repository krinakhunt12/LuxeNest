import { body, param } from 'express-validator';

export const createOrderValidator = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),

  body('items.*.product')
    .notEmpty()
    .withMessage('Product ID is required'),

  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1'),

  body('shippingAddress.name')
    .trim()
    .notEmpty()
    .withMessage('Name is required'),

  body('shippingAddress.phone')
    .trim()
    .notEmpty()
    .withMessage('Phone is required')
    .matches(/^\+?[\d\s-]{10,15}$/)
    .withMessage('Please provide a valid phone number'),

  body('shippingAddress.addressLine1')
    .trim()
    .notEmpty()
    .withMessage('Address line 1 is required'),

  body('shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),

  body('shippingAddress.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),

  body('shippingAddress.zipCode')
    .trim()
    .notEmpty()
    .withMessage('Zip code is required'),

  body('paymentMethod')
    .isIn(['UPI', 'CARD', 'NET_BANKING', 'COD'])
    .withMessage('Invalid payment method')
];

export const updateOrderStatusValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid order ID'),

  body('orderStatus')
    .isIn(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
    .withMessage('Invalid order status')
];

