const mongoose = require('mongoose');
require('dotenv').config();

async function getData() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fooddelivery');
    
    const Restaurant = require('./models/Restaurant');
    const MenuItem = require('./models/MenuItem');
    const User = require('./models/User');
    
    console.log('\n========== FOODHUB DATABASE CONTENTS ==========\n');
    
    // Get restaurants
    const restaurants = await Restaurant.find();
    console.log('RESTAURANTS (' + restaurants.length + '):');
    restaurants.forEach((r, i) => {
      console.log('  ' + (i+1) + '. ' + r.name + ' - Rating: ' + r.rating + ' - Delivery: ' + r.deliveryFee);
    });
    
    // Get menu items
    const items = await MenuItem.find();
    console.log('\nMENU ITEMS (' + items.length + '):');
    items.forEach((item, i) => {
      const veg = item.isVeg ? 'VEG' : 'NON-VEG';
      console.log('  ' + (i+1) + '. ' + item.name + ' - Price: ' + item.price + ' - ' + veg);
    });
    
    // Get users
    const users = await User.find({}, 'email name phone');
    console.log('\nUSERS (' + users.length + '):');
    users.forEach((u, i) => {
      console.log('  ' + (i+1) + '. ' + u.name + ' (' + u.email + ') - Phone: ' + u.phone);
    });
    
    console.log('\nDatabase Summary:');
    console.log('  - Restaurants: ' + restaurants.length);
    console.log('  - Menu Items: ' + items.length);
    console.log('  - Users: ' + users.length);
    console.log('');
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

getData();
