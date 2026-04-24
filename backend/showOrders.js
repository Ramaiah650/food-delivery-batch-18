const mongoose = require('mongoose');
const Order = require('./models/Order');

async function showOrders() {
  try {
    await mongoose.connect('mongodb://localhost:27017/food_delivery');

    const orders = await Order.find({})
      .populate('userId', 'name email')
      .populate('items.foodId', 'name price');

    console.log('📦 Orders in Database:');
    console.log('='.repeat(50));

    if (orders.length === 0) {
      console.log('No orders found yet. Place an order to see data here!');
    } else {
      orders.forEach((order, index) => {
        console.log(`Order ${index + 1}:`);
        console.log(`User: ${order.userId.name} (${order.userId.email})`);
        console.log(`Status: ${order.status}`);
        console.log(`Total: $${order.totalPrice}`);
        console.log(`Items: ${order.items.map(item => item.foodId.name + ' x' + item.quantity).join(', ')}`);
        console.log('');
      });
    }

    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

showOrders();