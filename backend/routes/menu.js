const express = require('express');
const MenuItem = require('../models/MenuItem');
const router = express.Router();

// Get all menu items
router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find({ isAvailable: true });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get menu item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get menu items by restaurant
router.get('/restaurant/:restaurantId', async (req, res) => {
  try {
    const items = await MenuItem.find({
      restaurantId: req.params.restaurantId,
      isAvailable: true
    }).populate('restaurantId');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get popular menu items
router.get('/popular/items', async (req, res) => {
  try {
    const items = await MenuItem.find({
      popular: true,
      isAvailable: true
    }).populate('restaurantId');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Filter menu items by category
router.get('/category/:category', async (req, res) => {
  try {
    const items = await MenuItem.find({
      category: req.params.category,
      isAvailable: true
    }).populate('restaurantId');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get vegetarian items
router.get('/filter/veg', async (req, res) => {
  try {
    const items = await MenuItem.find({
      isVeg: true,
      isAvailable: true
    }).populate('restaurantId');
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
