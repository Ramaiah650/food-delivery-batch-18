const express = require('express');
const { getAllFoodItems, getFoodItemById, addFoodItem } = require('../controllers/foodController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllFoodItems);
router.get('/:id', getFoodItemById);
router.post('/', auth, addFoodItem); // Assuming admin auth, but for simplicity using auth

module.exports = router;