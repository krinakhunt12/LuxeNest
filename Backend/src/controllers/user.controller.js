import User from '../models/User.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, data: user });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, preferences } = req.body;
  const updateData = {};

  if (name) updateData.name = name;
  if (phone) updateData.phone = phone;
  if (preferences) updateData.preferences = preferences;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updateData,
    { new: true, runValidators: true }
  );
  res.json({ success: true, data: user });
});

export const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses.push(req.body);
  await user.save();
  res.json({ success: true, data: user.addresses });
});

export const updateAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(id);
  if (!address) {
    return res.status(404).json({ success: false, message: 'Address not found' });
  }
  Object.assign(address, req.body);
  await user.save();
  res.json({ success: true, data: address });
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(req.user._id);
  user.addresses.pull(id);
  await user.save();
  res.json({ success: true, message: 'Address deleted' });
});

export const setDefaultAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(req.user._id);
  user.addresses.forEach(addr => {
    addr.isDefault = addr._id.toString() === id;
  });
  await user.save();
  res.json({ success: true, message: 'Default address updated' });
});

