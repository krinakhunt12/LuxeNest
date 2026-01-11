import express from 'express';
import { protect } from '../middlewares/auth.middleware.js';
import {
  getProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from '../controllers/user.controller.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/addresses', addAddress);
router.put('/addresses/:id', updateAddress);
router.delete('/addresses/:id', deleteAddress);
router.patch('/addresses/:id/default', setDefaultAddress);
router.get('/preferences', getProfile); // Preferences are part of user profile
router.put('/preferences', updateProfile); // Update preferences through profile update

export default router;

