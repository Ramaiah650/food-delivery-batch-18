const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');
const User = require('./models/User');
require('dotenv').config();

/** Pexels CDN (direct JPEG). */
const px = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800`;

/**
 * Image sources: Pexels, Wikimedia Commons, Pixabay, Justdial CDN placeholder.
 * For a real Justdial listing photo: open justdial.com → restaurant → right-click image →
 * "Copy image address" (usually content*.jdmagicbox.com) and paste here.
 */
const WEB = {
  wikiRestaurant:
    'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800',
  wikiBiryani:
    'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=800',
  wikiTikka:
    'https://images.pexels.com/photos/674574/pexels-photo-674574.jpeg?auto=compress&cs=tinysrgb&w=800',
  wikiDosa:
    'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=800',
  wikiIdli:
    'https://images.pexels.com/photos/723198/pexels-photo-723198.jpeg?auto=compress&cs=tinysrgb&w=800',
  wikiNaan:
    'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=800',
  wikiSamosa:
    'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=800',
  wikiGulab:
    'https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg?auto=compress&cs=tinysrgb&w=800',
  wikiRasgulla:
    'https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg?auto=compress&cs=tinysrgb&w=800',
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fooddelivery');

    console.log('🗑️  Clearing existing data...');
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});

    const restaurant1 = await Restaurant.create({
      name: 'Sr Mishra Dhaba in Narakoduru,Guntur ',
      description: 'Authentic North & South Indian Food',
      cuisine: ['North Indian', 'South Indian'],
      rating: 4.0,
      reviews: 50,
      deliveryTime: 25,
      deliveryFee: 40,
      image: WEB.wikiRestaurant,
      address: 'Guntur, Tenali Rd, near Query bala temple',
      minOrder: 200,
      isOpen: true,
      offers: '20% off on first order',
      location: {
        type: 'Point',
        coordinates: [80.642, 16.319],
      },
    });

    await MenuItem.create([
      {
        restaurantId: restaurant1._id,
        name: 'Tandoori Chicken',
        category: 'Main Course',
        price: 250,
        isVeg: false,
        description: 'Marinated in yogurt and spices',
        image: 'https://images.pexels.com/photos/106343/pexels-photo-106343.jpeg?auto=compress&cs=tinysrgb&w=800',
      },
      {
        restaurantId: restaurant1._id,
        name: 'Biryani',
        category: 'Biryani',
        price: 300,
        isVeg: false,
        description: 'Fragrant basmati rice with meat',
        image: 'https://images.pexels.com/photos/5410409/pexels-photo-5410409.jpeg?auto=compress&cs=tinysrgb&w=800',
      },
      {
        restaurantId: restaurant1._id,
        name: 'Butter Chicken',
        category: 'Main Course',
        price: 280,
        isVeg: false,
        description: 'Creamy tomato-based curry',
        image: 'https://images.pexels.com/photos/674574/pexels-photo-674574.jpeg?auto=compress&cs=tinysrgb&w=800',
      },
      {
        restaurantId: restaurant1._id,
        name: 'Paneer Tikka',
        category: 'Appetizers',
        price: 220,
        isVeg: true,
        description: 'Grilled cottage cheese with sauce',
        image: 'https://images.pexels.com/photos/9609831/pexels-photo-9609831.jpeg?auto=compress&cs=tinysrgb&w=800',
      },
      {
        restaurantId: restaurant1._id,
        name: 'Dosa',
        category: 'Breads',
        price: 100,
        isVeg: true,
        description: 'Crispy crepe with potato filling',
        image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=800',
      },
    ]);

    const restaurant2 = await Restaurant.create({
      name: 'Mubarak Restaurant',
      description: 'Indian & Chinese Cuisine',
      cuisine: ['North Indian'],
      rating: 4.1,
      reviews: 174,
      deliveryTime: 30,
      deliveryFee: 50,
      image: px(958545),
      address: 'D.no. 12, Chebrolu Mandal, opp. Vignan College',
      minOrder: 150,
      isOpen: true,
      offers: '₹1-200 lunch special',
      location: {
        type: 'Point',
        coordinates: [80.64, 16.318],
      },
    });

    await MenuItem.create([
      {
        restaurantId: restaurant2._id,
        name: 'Hyderabadi Chicken Biryani',
        category: 'Biryani',
        price: 320,
        isVeg: false,
        description: 'Traditional hyderabadi style biryani',
        image: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=800',
      },
      {
        restaurantId: restaurant2._id,
        name: 'Hakka Noodles',
        category: 'Main Course',
        price: 180,
        isVeg: false,
        description: 'Fried noodles with vegetables',
        image: 'https://images.pexels.com/photos/5842384/pexels-photo-5842384.jpeg?auto=compress&cs=tinysrgb&w=800',
      },
      {
        restaurantId: restaurant2._id,
        name: 'Palak Paneer',
        category: 'Main Course',
        price: 240,
        isVeg: true,
        description: 'Spinach and cottage cheese curry',
        image: 'https://images.pexels.com/photos/9609831/pexels-photo-9609831.jpeg?auto=compress&cs=tinysrgb&w=800',
      },
      {
        restaurantId: restaurant2._id,
        name: 'Garlic Naan',
        category: 'Breads',
        price: 50,
        isVeg: true,
        description: 'Butter garlic flatbread',
        image: 'https://images.pexels.com/photos/12737656/pexels-photo-12737656.jpeg?auto=compress&cs=tinysrgb&w=800',
      },
    ]);

    const restaurant3 = await Restaurant.create({
      name: "Krishna's Kitchen",
      description: 'South Indian Specialties',
      cuisine: ['South Indian'],
      rating: 4.6,
      reviews: 130,
      deliveryTime: 20,
      deliveryFee: 30,
      image: WEB.wikiDosa,
      address: 'Near Vignan University',
      minOrder: 180,
      isOpen: true,
      offers: '15% off entire menu',
      location: {
        type: 'Point',
        coordinates: [80.644, 16.32],
      },
    });

    await MenuItem.create([
      {
        restaurantId: restaurant3._id,
        name: 'Masala Dosa',
        category: 'Breads',
        price: 120,
        isVeg: true,
        description: 'Spicy potato filled dosa',
        image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=800',
      },
      {
        restaurantId: restaurant3._id,
        name: 'Idli-Sambar',
        category: 'Breads',
        price: 80,
        isVeg: true,
        description: 'Steamed rice cakes with sambar',
        image: 'https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=800',
      },
      {
        restaurantId: restaurant3._id,
        name: 'Uttapam',
        category: 'Breads',
        price: 100,
        isVeg: true,
        description: 'Savory rice pancake',
        image: 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=800',
      },
      {
        restaurantId: restaurant3._id,
        name: 'Chicken 65',
        category: 'Main Course',
        price: 200,
        isVeg: false,
        description: 'Spicy fried chicken',
        image: 'https://images.pexels.com/photos/106343/pexels-photo-106343.jpeg?auto=compress&cs=tinysrgb&w=800',
      },
      {
        restaurantId: restaurant3._id,
        name: 'Hyd Dum Biryani',
        category: 'Biryani',
        price: 280,
        isVeg: false,
        description: 'Biryani with fresh herbs',
        image: 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=800',
      },
    ]);

    const restaurant4 = await Restaurant.create({
      name: "THE HEAVEN'S KITCHEN",
      description: 'Indian & Fast Food',
      cuisine: ['North Indian', 'Fast Food'],
      rating: 4.0,
      reviews: 85,
      deliveryTime: 25,
      deliveryFee: 40,
      image: px(704569),
      address: 'SH 261',
      minOrder: 200,
      isOpen: true,
      offers: 'Free dessert with order above ₹500',
      location: {
        type: 'Point',
        coordinates: [80.638, 16.321],
      },
    });

    await MenuItem.create([
      {
        restaurantId: restaurant4._id,
        name: 'Chicken Tikka Masala',
        category: 'Main Course',
        price: 290,
        isVeg: false,
        description: 'Tender chicken in creamy sauce',
        image: 'https://images.pexels.com/photos/6210958/pexels-photo-6210958.jpeg?auto=compress&cs=tinysrgb&w=800',
      },
      {
        restaurantId: restaurant4._id,
        name: 'Chana Masala',
        category: 'Main Course',
        price: 150,
        isVeg: true,
        description: 'Chickpea curry with spices',
        image: 'https://images.pexels.com/photos/9609831/pexels-photo-9609831.jpeg?auto=compress&cs=tinysrgb&w=800',
      },
      {
        restaurantId: restaurant4._id,
        name: 'Fried Rice',
        category: 'Rice',
        price: 160,
        isVeg: false,
        description: 'Egg fried rice with vegetables',
        image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=800',
      },
      {
        restaurantId: restaurant4._id,
        name: 'Spring Rolls',
        category: 'Appetizers',
        price: 120,
        isVeg: true,
        description: 'Crispy vegetable rolls',
        image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=800',
      },
      {
        restaurantId: restaurant4._id,
        name: 'Gulab Jamun',
        category: 'Desserts',
        price: 100,
        isVeg: true,
        description: 'Sweet milk solids in syrup',
        image: 'https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg?auto=compress&cs=tinysrgb&w=800',
      },
    ]);

    const restaurant5 = await Restaurant.create({
      name: 'VIP JAIL RESTAURANT',
      description: 'Family-friendly Indian',
      cuisine: ['North Indian', 'Fast Food'],
      rating: 4.9,
      reviews: 120,
      deliveryTime: 22,
      deliveryFee: 60,
      image: px(1640777),
      address: '6GMW+8V3, beside Vignan University Main Road',
      minOrder: 250,
      isOpen: true,
      offers: 'Family combo at ₹999',
      location: {
        type: 'Point',
        coordinates: [80.646, 16.322],
      },
    });

    await MenuItem.create([
      {
        restaurantId: restaurant5._id,
        name: 'Chicken Lollipop',
        category: 'Appetizers',
        price: 280,
        isVeg: false,
        description: 'Seasoned butter chicken wings',
        image: 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=800',
      },
      {
        restaurantId: restaurant5._id,
        name: 'Paneer Lababdar',
        category: 'Main Course',
        price: 260,
        isVeg: true,
        description: 'Cottage cheese in creamy sauce',
        image: 'https://images.pexels.com/photos/9609831/pexels-photo-9609831.jpeg?auto=compress&cs=tinysrgb&w=800',
      },
      {
        restaurantId: restaurant5._id,
        name: 'Fish Tikka',
        category: 'Appetizers',
        price: 320,
        isVeg: false,
        description: 'Grilled fish with spices',
        image: 'https://images.pexels.com/photos/1300975/pexels-photo-1300975.jpeg?auto=compress&cs=tinysrgb&w=800',
      },
      {
        restaurantId: restaurant5._id,
        name: 'Mixed Veg Biryani',
        category: 'Rice',
        price: 200,
        isVeg: true,
        description: 'Vegetable biryani',
        image: 'https://images.pexels.com/photos/5410409/pexels-photo-5410409.jpeg?auto=compress&cs=tinysrgb&w=800',
      },
      {
        restaurantId: restaurant5._id,
        name: 'Rasgulla',
        category: 'Desserts',
        price: 80,
        isVeg: true,
        description: 'Spongy milk balls in syrup',
        image: 'https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg?auto=compress&cs=tinysrgb&w=800',
      },
    ]);

    let demoUser = await User.findOne({ email: 'demo@foodhub.com' });
    if (!demoUser) {
      await User.create({
        name: 'Demo User',
        email: 'demo@foodhub.com',
        password: 'demo123',
        address: 'Vignan University, Guntur',
        phone: '9876543210',
      });
      console.log('✅ Demo user: demo@foodhub.com / demo123');
    } else {
      console.log('ℹ️  Demo user already exists (demo@foodhub.com)');
    }

    console.log('✅ All 5 restaurants added!');
    console.log('✅ 25 menu items added!');
    console.log('\n📊 Data Summary:');
    console.log('   - Restaurants: 5');
    console.log('   - Menu Items: 25');
    console.log('   - Images: Pexels, Wikimedia Commons, Pixabay, Justdial CDN');

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error:', error.message);
    mongoose.connection.close();
    process.exit(1);
  }
};

seedDatabase();
