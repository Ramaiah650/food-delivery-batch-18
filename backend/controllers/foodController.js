const FoodItem = require('../models/FoodItem');

const getAllFoodItems = async (req, res) => {
  try {
    const foodItems = await FoodItem.find();
    res.json(foodItems);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getFoodItemById = async (req, res) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id);
    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.json(foodItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const addFoodItem = async (req, res) => {
  try {
    const { name, price, category, image, description } = req.body;

    const foodItem = new FoodItem({
      name,
      price,
      category,
      image,
      description
    });

    await foodItem.save();
    res.status(201).json(foodItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllFoodItems, getFoodItemById, addFoodItem };