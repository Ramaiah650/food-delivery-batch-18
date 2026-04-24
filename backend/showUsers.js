const mongoose = require('mongoose');
const User = require('./models/User');

async function showUsers() {
  try {
    await mongoose.connect('mongodb://localhost:27017/food_delivery');

    const users = await User.find({}).select('-password');

    console.log('📊 Users in Database:');
    console.log('='.repeat(50));

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Phone: ${user.phone}`);
      console.log(`   Address: ${user.address}`);
      console.log(`   Joined: ${user.createdAt.toLocaleDateString()}`);
      console.log('');
    });

    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

showUsers();