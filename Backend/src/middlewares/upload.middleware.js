import multer from 'multer';
import { logger } from '../utils/logger.js';
import fs from 'fs';
import path from 'path';

// Cloudinary configuration - will be initialized when needed
let cloudinary = null;

const initCloudinary = async () => {
  if (cloudinary) return cloudinary;

  if (process.env.CLOUDINARY_CLOUD_NAME) {
    try {
      const { v2 } = await import('cloudinary');
      cloudinary = v2;
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
      });
      logger.info('Cloudinary initialized');
    } catch (error) {
      logger.warn('Cloudinary not available, file uploads will be limited');
    }
  }
  return cloudinary;
};

// Memory storage for multer (uploads to memory first, then to Cloudinary or DB)
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  // Accept images, excel, and csv
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
    'application/vnd.ms-excel', // xls
    'text/csv', // csv
    'application/csv', // csv variation
    'text/x-csv', // csv variation
    'text/plain', // sometimes csv is sent as text/plain
  ];

  if (file.mimetype.startsWith('image/') || allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image, Excel, and CSV files are allowed'), false);
  }
};

// Multer configuration
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

/**
 * Upload single image to Cloudinary
 */
export const uploadToCloudinary = async (file, folder = 'luxenest') => {
  // Direct MongoDB Storage - Store as Base64 data URI
  if (!file) throw new Error('No file provided');

  const base64Data = file.buffer.toString('base64');
  return {
    secure_url: `data:${file.mimetype};base64,${base64Data}`,
    public_id: `db_${Date.now()}_${Math.round(Math.random() * 1000)}`
  };
};

/**
 * Upload multiple images to Cloudinary
 */
export const uploadMultipleToCloudinary = async (files, folder = 'luxenest') => {
  try {
    const uploadPromises = files.map(file => uploadToCloudinary(file, folder));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    logger.error(`Multiple upload error: ${error.message}`);
    throw error;
  }
};

/**
 * Delete image from Cloudinary
 */
export const deleteFromCloudinary = async (publicId) => {
  const cloudinaryInstance = await initCloudinary();
  if (!cloudinaryInstance) {
    throw new Error('Cloudinary not configured');
  }

  try {
    const result = await cloudinaryInstance.uploader.destroy(publicId);
    return result;
  } catch (error) {
    logger.error(`Cloudinary delete error: ${error.message}`);
    throw error;
  }
};

