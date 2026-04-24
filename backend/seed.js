const mongoose = require('mongoose');
const dotenv = require('dotenv');
const FoodItem = require('./models/FoodItem');

dotenv.config();

const seedData = [
  {
    name: 'Margherita Pizza',
    price: 299,
    category: 'Pizza',
    image: 'https://media.gettyimages.com/id/1446091569/photo/pizza-margherita-on-white-background.jpg?s=612x612&w=gi&k=20&c=pSQgUKzWKZd9QqAT6kyBfdzkooWQ2CBSQIJkBiLEYPQ=',
    description: 'Classic pizza with tomato sauce, mozzarella, and basil'
  },
  {
    name: 'Chicken Burger',
    price: 179,
    category: 'Burger',
    image: 'https://img.freepik.com/premium-photo/chicken-sandwich-with-tomato-lettuce-it_753921-782.jpg?semt=ais_hybrid&w=740&q=80',
    description: 'Juicy chicken burger with lettuce, tomato, and mayo'
  },
  {
    name: 'Caesar Salad',
    price: 199,
    category: 'Salad',
    image: 'https://feelgoodfoodie.net/wp-content/uploads/2020/04/Caesar-Salad-TIMG.jpg',
    description: 'Fresh romaine lettuce with Caesar dressing and croutons'
  },
  {
    name: 'Chocolate Cake',
    price: 149,
    category: 'Dessert',
    image: 'https://www.fnp.com/images/pr/l/v20221205202813/cream-drop-chocolate-cake_1.jpg',
    description: 'Rich chocolate cake with vanilla frosting'
  },
  {
    name: 'Pasta Carbonara',
    price: 279,
    category: 'Pasta',
    image: 'https://images.unsplash.com/photo-1551892376-c73a4c9d5b02?w=400&h=300&fit=crop&crop=center',
    description: 'Creamy pasta with bacon, eggs, and parmesan cheese'
  },
  {
    name: 'California Roll',
    price: 249,
    category: 'Sushi',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop&crop=center',
    description: 'Fresh sushi roll with avocado, cucumber, and crab'
  },
  {
    name: 'Vanilla Ice Cream',
    price: 99,
    category: 'Dessert',
    image: 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=400&h=300&fit=crop&crop=center',
    description: 'Creamy vanilla ice cream with chocolate chips'
  },
  {
    name: 'Cappuccino',
    price: 89,
    category: 'Beverage',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
    description: 'Hot cappuccino with steamed milk and foam'
  },
  {
    name: 'Pepperoni Pizza',
    price: 349,
    category: 'Pizza',
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop&crop=center',
    description: 'Classic pepperoni pizza with extra cheese'
  },
  {
    name: 'Grilled Salmon',
    price: 399,
    category: 'Main Course',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop&crop=center',
    description: 'Fresh grilled salmon with lemon butter sauce'
  },
  {
    name: 'French Fries',
    price: 99,
    category: 'Side',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop&crop=center',
    description: 'Crispy golden french fries with sea salt'
  },
  {
    name: 'Tiramisu',
    price: 179,
    category: 'Dessert',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop&crop=center',
    description: 'Classic Italian tiramisu with coffee and mascarpone'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await FoodItem.deleteMany(); // Clear existing data
    await FoodItem.insertMany(seedData);

    console.log('Database seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();