// ===== API Configuration =====
function resolveApiBase() {
    const override = (window.FOODHUB_API_BASE || localStorage.getItem('foodHubApiBase') || '').trim();
    if (override) return override.replace(/\/+$/, '');
    const isLocal = window.location.protocol === 'file:' || ['localhost', '127.0.0.1'].includes(window.location.hostname);
    return isLocal ? 'http://localhost:3000' : window.location.origin;
}

const API_URL = `${resolveApiBase()}/api`;
const PUBLIC_FOOD_API = 'https://www.themealdb.com/api/json/v1/1';

// ── Fallback image helpers ──────────────────────────────────────────────────
const DEFAULT_RESTAURANT_IMG = 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800';
const DEFAULT_DISH_IMG = 'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=800';

/**
 * MealDB image cache: food name → thumbnail URL
 * Populated lazily via fetchMealImageByName().
 */
const mealImageCache = {};

/** Fetch the best-matching MealDB image for a dish name. Returns URL or null. */
async function fetchMealImageByName(name) {
    const key = String(name || '').toLowerCase().trim();
    if (mealImageCache[key] !== undefined) return mealImageCache[key];
    try {
        const res = await fetch(`${PUBLIC_FOOD_API}/search.php?s=${encodeURIComponent(key)}`);
        if (!res.ok) { mealImageCache[key] = null; return null; }
        const data = await res.json().catch(() => ({}));
        const meal = Array.isArray(data.meals) ? data.meals[0] : null;
        const url = meal ? meal.strMealThumb : null;
        mealImageCache[key] = url;
        return url;
    } catch (_) {
        mealImageCache[key] = null;
        return null;
    }
}

const DISH_IMAGE_MAP = {
    // Biryani / Rice
    'biryani': 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg',
    'hyderabadi chicken biryani': 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg',
    'hyd dum biryani': 'https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg',
    'mixed veg biryani': 'https://img.freepik.com/premium-photo/traditional-hyderabadi-vegetable-veg-dum-biryani-with-mixed-veggies-served-with-mixed-raita-selective-focus_726363-27.jpg',
    'jeera rice': 'https://www.cookingcarnival.com/wp-content/uploads/2021/06/Jeera-rice-2.jpg',

    // Chicken
    'tandoori chicken': 'https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg',
    'butter chicken': 'https://s.yimg.com/fz/api/res/1.2/Emd2GVRf94Sbf7s7IrsxyQ--~C/YXBwaWQ9c3JjaGRkO2ZpPWZpbGw7aD00MTI7cHhvZmY9NTA7cHlvZmY9MTAwO3E9ODA7c3M9MTt3PTM4OA--/https://i.pinimg.com/736x/91/97/7a/91977a83067bafb6095c80031bfc8b2a.jpg',
    'chicken tikka masala': 'https://tse1.mm.bing.net/th/id/OIP.jGdycTk_YqlC2lSKe5x-JwHaHa?pid=Api&P=0&h=180',
    'chicken 65': 'https://theflavoursofkitchen.com/wp-content/uploads/2021/08/Chicken-65-3-scaled.jpg',
    'chicken lollipop': 'https://tse4.mm.bing.net/th/id/OIP.XD_h36tpTHaEQGnkAfLOAAHaHa?pid=Api&P=0&h=180',

    // Paneer
    'paneer tikka': 'https://img.freepik.com/premium-photo/paneer-tikka-image-black-background_893610-39891.jpg?w=2000',
    'palak paneer': 'https://feastwithsafiya.com/wp-content/uploads/2021/11/saag-recipe.jpg',
    'paneer butter masala': 'https://www.funfoodfrolic.com/wp-content/uploads/2020/12/Kadhai-Paneer-Thumbnail-1024x1024.jpg',
    'paneer lababdar': 'https://thewhiskaddict.com/wp-content/uploads/2022/06/paneer-recipes.jpg',
    'kadai paneer': 'https://www.funfoodfrolic.com/wp-content/uploads/2020/12/Kadhai-Paneer-Thumbnail-1024x1024.jpg',
    'malai kofta': 'https://recetinas.com/wp-content/uploads/2022/07/malai-kofta-1024x682.jpg',

    // South Indian
    'dosa': 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg',
    'masala dosa': 'https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg',
    'idli-sambar': 'https://img.freepik.com/premium-photo/idly-sambar-idli-with-sambhar-green-red-chutney-popular-south-indian-breakfast_999766-2537.jpg?w=900',
    'uttapam': 'https://www.cookingcarnival.com/wp-content/uploads/2022/02/Uttapam-1.jpg',
    'rava kesari': 'https://img-global.cpcdn.com/recipes/f5e611a1a29cbe61/680x482cq70/rava-kesari-sheerasuji-halwakesaribath-recipe-main-photo.jpg',

    // Dal / Veg
    'dal tadka': 'https://simplytadka.com/wp-content/uploads/2023/05/dal-tadka.jpg',
    'chana masala': 'https://currytown.ca/wp-content/uploads/2023/09/chana-masala-recipe.jpg',
    'veg korma': 'https://i.pinimg.com/originals/0f/13/7d/0f137d2a243f7b63e5716ab4c10c3ee3.jpg',
    'veg meals thali': 'https://i.pinimg.com/originals/0f/13/7d/0f137d2a243f7b63e5716ab4c10c3ee3.jpg',

    // Bread
    'garlic naan': 'https://www.vegrecipesofindia.com/wp-content/uploads/2022/12/garlic-naan-1.jpg',
    'aloo paratha': 'https://www.cookwithnabeela.com/wp-content/uploads/2024/03/AlooParatha.webp',

    // Lamb / Mutton
    'lamb nihari': 'https://rukycooks.com/wp-content/uploads/2025/07/Blog-pics-6.png',

    // Chinese
    'hakka noodles': 'https://www.whiskaffair.com/wp-content/uploads/2020/03/Hakka-Noodles-2-3.jpg',
    'fried rice': 'https://www.wholesomeyum.com/wp-content/uploads/2023/02/wholesomeyum-Easy-Fried-Rice-Recipe-1.jpg',
    'spring rolls': 'https://www.elmundoeats.com/wp-content/uploads/2024/02/Crispy-spring-rolls.jpg',

    // Snacks
    'samosa': 'https://i.pinimg.com/originals/64/16/73/6416733eeda35bf65bfa757d6d4c39c0.jpg',

    // Seafood
    'fish tikka': 'https://mlttzuamhjgu.i.optimole.com/JTrsWuM-NkBPBgJr/w:auto/h:auto/q:90/https://tasteofnations.ch/wp-content/uploads/2020/06/fish-tikka-1-scaled.jpg',

    // Desserts
    'gulab jamun': 'https://www.foodie-trail.com/wp-content/uploads/2020/04/PHOTO-2022-02-12-20-04-41_1.jpg',
    'rasgulla': 'https://img.freepik.com/premium-photo/rasgulla-popular-indian-sweet-made-with-soft-spongy-cottage-cheese-paneer-balls_1230902-697.jpg?w=2000',
    'kheer': 'https://cdn.grofers.com/assets/search/usecase/banner/kheer_01.png',
};

/**
 * Resolve the best image for a dish.
 * Priority: stored URL in item > DISH_IMAGE_MAP match > default.
 */
function resolveDishImage(item) {
    const nameLower = String(item?.name || '').toLowerCase().trim();
    
    // First priority: stored URL in database
    if (validImageUrl(item?.image)) return item.image.trim();
    
    // Second priority: exact match in DISH_IMAGE_MAP
    if (DISH_IMAGE_MAP[nameLower]) return DISH_IMAGE_MAP[nameLower];
    
    // Third priority: partial match in DISH_IMAGE_MAP
    for (const [key, url] of Object.entries(DISH_IMAGE_MAP)) {
        if (nameLower.includes(key) || key.includes(nameLower)) return url;
    }
    
    return DEFAULT_DISH_IMG;
}

function validImageUrl(url) {
    return url && typeof url === 'string' && /^https?:\/\//i.test(url.trim());
}

function restaurantImageUrl(url) {
    return validImageUrl(url) ? url.trim() : DEFAULT_RESTAURANT_IMG;
}

function dishImageUrl(item) {
    // Accepts an item object OR a plain URL string (legacy calls)
    if (typeof item === 'string') {
        return validImageUrl(item) ? item.trim() : DEFAULT_DISH_IMG;
    }
    return resolveDishImage(item);
}

function imgOnErrorFallback(fallbackUrl) {
    return `this.onerror=null;this.src='${fallbackUrl}'`;
}

function normalizeCuisineKey(cuisine) {
    return String(cuisine || 'all').trim().toLowerCase();
}

const CUISINE_ITEM_KEYWORDS = {
    indian: ['curry', 'masala', 'paneer', 'dal', 'naan', 'thali', 'biryani', 'dosa', 'idli'],
    'north indian': ['biryani', 'tikka', 'butter', 'naan', 'paratha', 'nihari', 'kebab'],
    'south indian': ['dosa', 'idli', 'uttapam', 'sambar', 'upma', 'rava', 'kesari'],
    chinese: ['noodle', 'fried rice', 'manchurian', 'spring roll', 'hakka', 'chow'],
    'fast food': ['burger', 'pizza', 'sandwich', 'fries', 'roll', 'wrap', 'pasta'],
    desserts: ['cake', 'ice cream', 'sweet', 'jamun', 'rasgulla', 'kheer', 'halwa', 'pudding', 'kesari'],
};

function itemMatchesCuisine(item, cuisine = 'all') {
    const key = normalizeCuisineKey(cuisine);
    if (key === 'all') return true;
    const category = String(item?.category || '').toLowerCase();
    const name = String(item?.name || '').toLowerCase();
    const description = String(item?.description || '').toLowerCase();
    const searchable = `${name} ${category} ${description}`;
    const keywords = CUISINE_ITEM_KEYWORDS[key] || [];
    if (category === key) return true;
    if (key === 'indian' && (category === 'north indian' || category === 'south indian')) return true;
    return keywords.some((word) => searchable.includes(word));
}

const CUISINE_QUERY_MAP = {
    all: ['chicken', 'rice', 'paneer', 'noodles', 'cake'],
    Indian: ['curry', 'paneer','pannerbutter', 'masala', 'biryani'],
    'North Indian': ['biryani', 'tikka', 'butter chicken', 'naan'],
    'South Indian': ['dosa', 'idli', 'sambar', 'upma'],
    Chinese: ['noodles', 'fried rice', 'manchurian', 'chow mein'],
    'Fast Food': ['burger', 'pizza', 'sandwich', 'fries'],
    Desserts: ['cake', 'ice cream', 'pudding', 'sweet'],
};

// ===== Global State =====
let restaurants = [];
let currentRestaurant = null;
let cart = [];
let currentFilter = 'all';
let userLocation = { lat: 16.3190, lng: 80.6420 };
let map;
let markers = [];
let searchDebounceTimer = null;

const FREE_DELIVERY_THRESHOLD = 300;

function getCartRestaurant() {
    if (!cart.length) return null;
    const rid = cart[0].restaurantId;
    return restaurants.find((r) => String(r._id) === String(rid)) || null;
}

function computeRestaurantTotal(items) {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
function computeCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const gstPct = 5;
    const gst = Math.round(subtotal * (gstPct / 100));
    const platformFee = subtotal > 0 ? 2 : 0;
    const r = getCartRestaurant();
    const restaurantDelivery = r != null && r.deliveryFee != null ? Number(r.deliveryFee) : 40;
    const minOrder = r != null && r.minOrder != null ? Number(r.minOrder) : 200;
    const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : restaurantDelivery;
    const grandTotal = subtotal + gst + platformFee + delivery;
    const minOrderGap = Math.max(0, minOrder - subtotal);
    const freeDeliveryGap = subtotal < FREE_DELIVERY_THRESHOLD ? Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal) : 0;
    return { subtotal, gst, gstPct, platformFee, delivery, restaurantDelivery, grandTotal, itemCount, minOrder, minOrderGap, freeDeliveryGap };
}

function syncCartFooter(t) {
    const subEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const platEl = document.getElementById('platformFee');
    const delEl = document.getElementById('deliveryFee');
    const totalEl = document.getElementById('cartTotal');
    const countLabel = document.getElementById('cartItemCountLabel');
    const minNote = document.getElementById('cartMinOrderNote');
    const freeNote = document.getElementById('cartFreeDeliveryNote');
    if (subEl) subEl.textContent = String(t.subtotal);
    if (taxEl) taxEl.textContent = String(t.gst);
    if (platEl) platEl.textContent = String(t.platformFee);
    if (delEl) {
        if (t.subtotal === 0) { delEl.textContent = '0'; delEl.classList.remove('delivery-free-tag'); }
        else if (t.delivery === 0) { delEl.textContent = 'FREE'; delEl.classList.add('delivery-free-tag'); }
        else { delEl.textContent = String(t.delivery); delEl.classList.remove('delivery-free-tag'); }
    }
    if (totalEl) totalEl.textContent = String(t.grandTotal);
    if (countLabel) countLabel.textContent = '(' + t.itemCount + ' item' + (t.itemCount === 1 ? '' : 's') + ')';
    if (minNote) {
        if (t.subtotal > 0 && t.minOrderGap > 0) {
            minNote.textContent = 'Minimum order ₹' + t.minOrder + ' for this restaurant · Add ₹' + t.minOrderGap + ' more';
            minNote.classList.remove('hidden');
        } else { minNote.textContent = ''; minNote.classList.add('hidden'); }
    }
    if (freeNote) {
        if (t.subtotal > 0 && t.delivery > 0 && t.freeDeliveryGap > 0) {
            freeNote.textContent = 'FREE delivery on orders ₹' + FREE_DELIVERY_THRESHOLD + '+ · Add ₹' + t.freeDeliveryGap + ' more';
            freeNote.classList.remove('hidden');
        } else { freeNote.textContent = ''; freeNote.classList.add('hidden'); }
    }
}

// ===== Expanded Manual Restaurant Data =====
const manualRestaurants = [
    {
        _id: '1',
        name: 'Thanmayi Family Dhaba',
        cuisine: ['Indian', 'North Indian', 'South Indian'],
        rating: 4.0,
        deliveryTime: 25,
        minOrder: 200,
        deliveryFee: 40,
        offers: '20% off on first order',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Restaurant_Bosphorus.jpg/800px-Restaurant_Bosphorus.jpg',
        address: 'Guntur, Tenali Rd, near Query bala koteswara swami temple',
        phone: '9876543210',
        menu: [
            { _id: '101', name: 'Tandoori Chicken', category: 'North Indian', price: 250, isVeg: false, description: 'Marinated in yogurt and spices, cooked in tandoor' },
            { _id: '102', name: 'Biryani', category: 'North Indian', price: 300, isVeg: false, description: 'Fragrant basmati rice with tender meat and whole spices' },
            { _id: '103', name: 'Butter Chicken', category: 'North Indian', price: 280, isVeg: false, description: 'Creamy tomato-based curry with tender chicken' },
            { _id: '104', name: 'Paneer Tikka', category: 'Indian', price: 220, isVeg: true, description: 'Grilled cottage cheese with tangy marinade' },
            { _id: '105', name: 'Masala Dosa', category: 'South Indian', price: 100, isVeg: true, description: 'Crispy crepe with spiced potato filling' },
            { _id: '106', name: 'Dal Tadka', category: 'Indian', price: 180, isVeg: true, description: 'Yellow lentils tempered with cumin and garlic' },
            { _id: '107', name: 'Jeera Rice', category: 'Indian', price: 130, isVeg: true, description: 'Basmati rice flavored with cumin and ghee' },
            { _id: '108', name: 'Idli-Sambar', category: 'South Indian', price: 80, isVeg: true, description: 'Steamed rice cakes with spiced lentil soup' },
            { _id: '109', name: 'Chicken Tikka Masala', category: 'North Indian', price: 290, isVeg: false, description: 'Tender chicken pieces in rich spiced gravy' },
            { _id: '110', name: 'Aloo Paratha', category: 'North Indian', price: 120, isVeg: true, description: 'Stuffed wheat flatbread served with curd and pickle' },
            { _id: '111', name: 'Uttapam', category: 'South Indian', price: 95, isVeg: true, description: 'Thick savory pancake with onion and tomato topping' },
            { _id: '112', name: 'Garlic Naan', category: 'Indian', price: 50, isVeg: true, description: 'Soft butter garlic flatbread from tandoor' },
        ]
    },
    {
        _id: '2',
        name: 'Mubarak Restaurant',
        cuisine: ['Indian', 'North Indian', 'Chinese', 'Desserts'],
        rating: 4.1,
        deliveryTime: 30,
        minOrder: 150,
        deliveryFee: 50,
        offers: '₹1-200 lunch special',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/640px-Good_Food_Display_-_NCI_Visuals_Online.jpg',
        address: 'D.no. 12, Chebrolu Mandal, opp. Vignan College',
        phone: '9876543211',
        menu: [
            { _id: '201', name: 'Hyderabadi Chicken Biryani', category: 'North Indian', price: 320, isVeg: false, description: 'Traditional Hyderabadi dum biryani with saffron' },
            { _id: '202', name: 'Lamb Nihari', category: 'North Indian', price: 350, isVeg: false, description: 'Slow-cooked tender lamb in rich curry' },
            { _id: '203', name: 'Hakka Noodles', category: 'Chinese', price: 180, isVeg: false, description: 'Stir-fried noodles with vegetables and egg' },
            { _id: '204', name: 'Palak Paneer', category: 'Indian', price: 240, isVeg: true, description: 'Cottage cheese in creamy spinach gravy' },
            { _id: '205', name: 'Garlic Naan', category: 'Indian', price: 50, isVeg: true, description: 'Butter garlic flatbread from the tandoor' },
            { _id: '206', name: 'Paneer Butter Masala', category: 'Indian', price: 260, isVeg: true, description: 'Paneer cubes in rich tomato-butter gravy' },
            { _id: '207', name: 'Gulab Jamun', category: 'Desserts', price: 110, isVeg: true, description: 'Soft milk dumplings soaked in rose sugar syrup' },
            { _id: '208', name: 'Chana Masala', category: 'Indian', price: 150, isVeg: true, description: 'Spicy chickpea curry cooked in tangy tomatoes' },
            { _id: '209', name: 'Fried Rice', category: 'Chinese', price: 160, isVeg: false, description: 'Egg fried rice with mixed vegetables and soy sauce' },
            { _id: '210', name: 'Butter Chicken', category: 'North Indian', price: 280, isVeg: false, description: 'Chicken in silky tomato cream gravy' },
            { _id: '211', name: 'Rasgulla', category: 'Desserts', price: 90, isVeg: true, description: 'Light spongy milk balls soaked in sugar syrup' },
            { _id: '212', name: 'Spring Rolls', category: 'Chinese', price: 130, isVeg: true, description: 'Crispy rolls stuffed with spiced vegetables' },
        ]
    },
    {
        _id: '3',
        name: "Krishna's Kitchen",
        cuisine: ['South Indian', 'Indian'],
        rating: 4.6,
        deliveryTime: 20,
        minOrder: 180,
        deliveryFee: 30,
        offers: '15% off entire menu',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Dosa_%28morning_breakfast%29.jpg/640px-Dosa_%28morning_breakfast%29.jpg',
        address: 'near Vignan University',
        phone: '9876543212',
        menu: [
            { _id: '301', name: 'Masala Dosa', category: 'South Indian', price: 120, isVeg: true, description: 'Crispy dosa filled with spiced potato masala' },
            { _id: '302', name: 'Idli-Sambar', category: 'South Indian', price: 80, isVeg: true, description: 'Steamed rice cakes with aromatic sambar' },
            { _id: '303', name: 'Uttapam', category: 'South Indian', price: 100, isVeg: true, description: 'Thick rice pancake with onion and tomato' },
            { _id: '304', name: 'Chicken 65', category: 'Indian', price: 200, isVeg: false, description: 'Deep-fried spicy chicken — a Hyderabadi classic' },
            { _id: '305', name: 'Hyd Dum Biryani', category: 'North Indian', price: 280, isVeg: false, description: 'Slow-cooked biryani with fresh herbs and saffron' },
            { _id: '306', name: 'Veg Meals Thali', category: 'Indian', price: 190, isVeg: true, description: 'Complete South Indian meal with rice, dal, curry, roti and pickle' },
            { _id: '307', name: 'Rava Kesari', category: 'Desserts', price: 90, isVeg: true, description: 'Sweet semolina pudding with ghee and cashews' },
            { _id: '308', name: 'Dal Tadka', category: 'Indian', price: 160, isVeg: true, description: 'Yellow dal tempered with ghee and cumin' },
            { _id: '309', name: 'Palak Paneer', category: 'Indian', price: 230, isVeg: true, description: 'Fresh spinach gravy with cottage cheese' },
            { _id: '310', name: 'Garlic Naan', category: 'Indian', price: 50, isVeg: true, description: 'Soft tandoor-baked garlic flatbread' },
            { _id: '311', name: 'Paneer Tikka', category: 'Indian', price: 210, isVeg: true, description: 'Chargrilled paneer with bell peppers and spices' },
            { _id: '312', name: 'Gulab Jamun', category: 'Desserts', price: 100, isVeg: true, description: 'Two warm gulab jamuns with vanilla ice cream' },
        ]
    },
    {
        _id: '4',
        name: "THE HEAVEN'S KITCHEN",
        cuisine: ['Indian', 'Fast Food', 'Desserts'],
        rating: 4.0,
        deliveryTime: 25,
        minOrder: 200,
        deliveryFee: 40,
        offers: 'Free dessert with order above ₹500',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/PNG_transparency_demonstration_1.png/640px-PNG_transparency_demonstration_1.png',
        address: 'SH 261',
        phone: '9876543213',
        menu: [
            { _id: '401', name: 'Chicken Tikka Masala', category: 'North Indian', price: 290, isVeg: false, description: 'Tender chicken in creamy spiced tomato sauce' },
            { _id: '402', name: 'Chana Masala', category: 'Indian', price: 150, isVeg: true, description: 'Chickpea curry slow-cooked with aromatic spices' },
            { _id: '403', name: 'Fried Rice', category: 'Chinese', price: 160, isVeg: false, description: 'Wok-tossed egg fried rice with seasonal vegetables' },
            { _id: '404', name: 'Spring Rolls', category: 'Indian', price: 120, isVeg: true, description: 'Crunchy rolls with seasoned vegetable stuffing' },
            { _id: '405', name: 'Gulab Jamun', category: 'Desserts', price: 100, isVeg: true, description: 'Classic gulab jamuns in warm sugar syrup' },
            { _id: '406', name: 'Veg Korma', category: 'Indian', price: 210, isVeg: true, description: 'Mixed vegetables in aromatic coconut-based gravy' },
            { _id: '407', name: 'Aloo Paratha', category: 'North Indian', price: 120, isVeg: true, description: 'Spiced potato-stuffed paratha with butter and curd' },
            { _id: '408', name: 'Butter Chicken', category: 'North Indian', price: 275, isVeg: false, description: 'Mughal-style chicken in rich buttery tomato gravy' },
            { _id: '409', name: 'Hakka Noodles', category: 'Chinese', price: 170, isVeg: true, description: 'Tossed noodles with fresh vegetables in Indo-Chinese style' },
            { _id: '410', name: 'Dal Tadka', category: 'Indian', price: 170, isVeg: true, description: 'Comforting yellow lentils with a garlic-cumin tadka' },
            { _id: '411', name: 'Paneer Butter Masala', category: 'Indian', price: 255, isVeg: true, description: 'Rich paneer curry in velvety butter-tomato sauce' },
            { _id: '412', name: 'Rasgulla', category: 'Desserts', price: 85, isVeg: true, description: 'Soft cottage cheese balls in chilled sugar syrup' },
        ]
    },
    {
        _id: '5',
        name: 'VIP JAIL RESTAURANT',
        cuisine: ['Family-friendly', 'Indian', 'Desserts'],
        rating: 4.9,
        deliveryTime: 22,
        minOrder: 250,
        deliveryFee: 60,
        offers: 'Family combo at ₹999',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Restaurant_Bosphorus.jpg/800px-Restaurant_Bosphorus.jpg',
        address: '6GMW+8V3, beside Vignan University Main Road',
        phone: '9876543214',
        menu: [
            { _id: '501', name: 'Chicken Lollipop', category: 'Indian', price: 280, isVeg: false, description: 'Juicy chicken wings seasoned with herbs and spices' },
            { _id: '502', name: 'Paneer Lababdar', category: 'Indian', price: 260, isVeg: true, description: 'Cottage cheese cubes in luscious onion-tomato gravy' },
            { _id: '503', name: 'Fish Tikka', category: 'Indian', price: 320, isVeg: false, description: 'Marinated grilled fish with mint chutney' },
            { _id: '504', name: 'Mixed Veg Biryani', category: 'North Indian', price: 200, isVeg: true, description: 'Fragrant vegetable biryani cooked dum-style' },
            { _id: '505', name: 'Rasgulla', category: 'Desserts', price: 80, isVeg: true, description: 'Spongy milk balls in light rose sugar syrup' },
            { _id: '506', name: 'Kadai Paneer', category: 'Indian', price: 270, isVeg: true, description: 'Paneer in bold spicy onion-tomato masala' },
            { _id: '507', name: 'Malai Kofta', category: 'Indian', price: 260, isVeg: true, description: 'Paneer-potato dumplings in creamy white gravy' },
            { _id: '508', name: 'Hyderabadi Chicken Biryani', category: 'North Indian', price: 330, isVeg: false, description: 'Authentic dum biryani with kewra and saffron' },
            { _id: '509', name: 'Butter Chicken', category: 'North Indian', price: 285, isVeg: false, description: 'Mildly spiced chicken in a creamy tomato sauce' },
            { _id: '510', name: 'Gulab Jamun', category: 'Desserts', price: 100, isVeg: true, description: 'Served hot with a scoop of ice cream' },
            { _id: '511', name: 'Tandoori Chicken', category: 'North Indian', price: 260, isVeg: false, description: 'Full tandoori chicken half-portion with mint raita' },
            { _id: '512', name: 'Chana Masala', category: 'Indian', price: 155, isVeg: true, description: 'Classic Punjabi chickpea curry with bhatura' },
        ]
    }
];

// ===== DOM Elements =====
const restaurantGrid = document.getElementById('restaurantGrid');
const cartCount = document.getElementById('cartCount');
const cartSidebar = document.getElementById('cartSidebar');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const locationText = document.getElementById('locationText');

// ===== Initialize App =====
document.addEventListener('DOMContentLoaded', function () {
    loadRestaurants();
    setupEventListeners();
    getLocation();
    loadCartFromStorage();
    updateCartDisplay();
    refreshAuthNav();

    const profileBtn = document.getElementById('profileAvatarBtn');
    if (profileBtn) {
        profileBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleProfileDropdown();
        });
    }
    document.addEventListener('click', function () { closeProfileDropdown(); });
    const profileWrap = document.getElementById('profileMenuWrap');
    if (profileWrap) profileWrap.addEventListener('click', function (e) { e.stopPropagation(); });
});

// ===== Setup Event Listeners =====
function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function () {
            clearTimeout(searchDebounceTimer);
            searchDebounceTimer = setTimeout(searchRestaurants, 250);
        });
        searchInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') { e.preventDefault(); searchRestaurants(); }
        });
    }
    const navSearchInput = document.getElementById('navSearchInput');
    if (navSearchInput) {
        navSearchInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') { e.preventDefault(); navSearch(); }
        });
        const searchIcon = navSearchInput.parentElement.querySelector('.search-icon');
        if (searchIcon) {
            searchIcon.addEventListener('click', navSearch);
        }
    }
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) hamburger.addEventListener('click', toggleMobileMenu);
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) checkoutForm.addEventListener('submit', handleCheckout);
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) cartIcon.addEventListener('click', toggleCart);
    const changeLocationBtn = document.querySelector('.change-location-btn');
    if (changeLocationBtn) changeLocationBtn.addEventListener('click', openLocationModal);
}

function refreshAuthNav() {
    const token = localStorage.getItem('foodHubToken');
    const userStr = localStorage.getItem('foodHubUser');
    const loginLink = document.getElementById('navLoginLink');
    const profileWrap = document.getElementById('profileMenuWrap');
    if (!loginLink || !profileWrap) return;
    const loggedIn = !!(token && userStr);
    if (loggedIn) {
        loginLink.classList.add('hidden');
        profileWrap.classList.remove('hidden');
        let u = {};
        try { u = JSON.parse(userStr); } catch (_) {}
        const name = (u.name || 'User').trim();
        const parts = name.split(/\s+/).filter(Boolean);
        const initials = parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : (name.slice(0, 2) || 'U').toUpperCase();
        const elI = document.getElementById('profileAvatarInitials');
        const elN = document.getElementById('profileDropName');
        const elE = document.getElementById('profileDropEmail');
        if (elI) elI.textContent = initials;
        if (elN) elN.textContent = name;
        if (elE) elE.textContent = u.email || '';
    } else {
        loginLink.classList.remove('hidden');
        profileWrap.classList.add('hidden');
        closeProfileDropdown();
    }
}

function closeProfileDropdown() {
    const dd = document.getElementById('profileDropdown');
    const btn = document.getElementById('profileAvatarBtn');
    if (dd) dd.setAttribute('hidden', '');
    if (btn) btn.setAttribute('aria-expanded', 'false');
}

function toggleProfileDropdown() {
    const dd = document.getElementById('profileDropdown');
    const btn = document.getElementById('profileAvatarBtn');
    if (!dd || !btn) return;
    if (dd.hasAttribute('hidden')) { dd.removeAttribute('hidden'); btn.setAttribute('aria-expanded', 'true'); }
    else { closeProfileDropdown(); }
}

function logoutFromApp() {
    closeProfileDropdown();
    localStorage.removeItem('foodHubToken');
    localStorage.removeItem('foodHubUser');
    localStorage.removeItem('foodHubRemember');
    refreshAuthNav();
    showNotification('Logged out successfully');
}

function openProfileDetailsModal() {
    closeProfileDropdown();
    const raw = localStorage.getItem('foodHubUser');
    if (!raw) { window.location.href = 'login.html'; return; }
    let u = {};
    try { u = JSON.parse(raw); } catch (_) { return; }
    const existing = document.getElementById('profileDetailsModal');
    if (existing) existing.remove();
    const wrap = document.createElement('div');
    wrap.id = 'profileDetailsModal';
    wrap.className = 'app-sheet-modal';
    wrap.innerHTML = '<div class="sheet"><button type="button" class="sheet-close" aria-label="Close">&times;</button><h2>My profile</h2>' +
        '<div class="form-group" style="margin-bottom:12px;"><label>Name</label><p style="margin:4px 0 0;font-weight:600;">' + escapeHtml(u.name || '—') + '</p></div>' +
        '<div class="form-group" style="margin-bottom:12px;"><label>Email</label><p style="margin:4px 0 0;">' + escapeHtml(u.email || '—') + '</p></div>' +
        '<div class="form-group" style="margin-bottom:12px;"><label>Phone</label><p style="margin:4px 0 0;">' + escapeHtml(u.phone || '—') + '</p></div>' +
        '<div class="form-group" style="margin-bottom:12px;"><label>Address</label><p style="margin:4px 0 0;">' + escapeHtml(u.address || '—') + '</p></div>' +
        '<p style="font-size:0.85rem;color:#888;margin-top:1rem;">To change details, contact support or create a new account.</p></div>';
    document.body.appendChild(wrap);
    wrap.querySelector('.sheet-close').onclick = () => wrap.remove();
    wrap.addEventListener('click', function (e) { if (e.target === wrap) wrap.remove(); });
}

function escapeHtml(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
}

async function openMyOrdersModal() {
    closeProfileDropdown();
    const token = localStorage.getItem('foodHubToken');
    const userStr = localStorage.getItem('foodHubUser');
    if (!token || !userStr) { window.location.href = 'login.html'; return; }
    let uid;
    try { uid = JSON.parse(userStr).id; } catch (_) {}
    if (!uid) { showNotification('Sign in again to view orders'); return; }
    const existing = document.getElementById('myOrdersModal');
    if (existing) existing.remove();
    const wrap = document.createElement('div');
    wrap.id = 'myOrdersModal';
    wrap.className = 'app-sheet-modal';
    wrap.innerHTML = '<div class="sheet"><button type="button" class="sheet-close" aria-label="Close">&times;</button><h2>My orders</h2><div id="ordersModalBody" style="padding:1rem 0;color:#666;">Loading…</div></div>';
    document.body.appendChild(wrap);
    const close = () => wrap.remove();
    wrap.querySelector('.sheet-close').onclick = close;
    wrap.addEventListener('click', function (e) { if (e.target === wrap) close(); });
    const body = document.getElementById('ordersModalBody');
    try {
        const res = await fetch(`${API_URL}/order/user/${uid}`, { headers: { Authorization: 'Bearer ' + token } });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) { body.innerHTML = '<p>' + escapeHtml(data.message || 'Could not load orders.') + '</p>'; return; }
        if (!Array.isArray(data) || data.length === 0) { body.innerHTML = '<p>No orders yet.</p>'; return; }
        body.innerHTML = '<div class="orders-list">' + data.map(function (o) {
            const id = o._id ? String(o._id) : '';
            const st = o.status || 'pending';
            const total = o.totalPrice != null ? o.totalPrice : '—';
            return '<div class="order-card"><div class="oid">#' + escapeHtml(id.slice(-8)) + '</div><div>Status: ' + escapeHtml(st) + '</div><div>Total: ₹' + escapeHtml(String(total)) + '</div></div>';
        }).join('') + '</div>';
    } catch (err) { body.innerHTML = '<p>Network error loading orders.</p>'; }
}

// ===== Load Restaurants =====
async function loadRestaurants() {
    try {
        const response = await fetch(`${API_URL}/restaurants`);
        if (response.ok) {
            restaurants = await response.json();
        } else {
            restaurants = manualRestaurants;
        }
        renderRestaurants();
    } catch (error) {
        restaurants = manualRestaurants;
        renderRestaurants();
    }
    await displayFeaturedItems();
}

// ===== Render Restaurants =====
function renderRestaurants() {
    restaurantGrid.innerHTML = '';
    let filteredRestaurants = restaurants;
    if (currentFilter !== 'all') {
        filteredRestaurants = restaurants.filter(r =>
            (r.cuisine || []).some(c => c.toLowerCase() === currentFilter.toLowerCase())
        );
    }
    if (filteredRestaurants.length === 0) {
        restaurantGrid.innerHTML = '<p class="no-results">No restaurants found. Try another filter.</p>';
        return;
    }
    filteredRestaurants.forEach(restaurant => {
        restaurantGrid.appendChild(createRestaurantCard(restaurant));
    });
}

// ===== Create Restaurant Card =====
function createRestaurantCard(restaurant) {
    const card = document.createElement('div');
    card.className = 'restaurant-card';
    const cuisineText = (restaurant.cuisine || []).join(', ');
    const deliveryTime = restaurant.deliveryTime || 30;
    const image = restaurantImageUrl(restaurant.image);
    card.innerHTML = `
        <img src="${image}" alt="${restaurant.name}" style="width:100%;height:200px;object-fit:cover;background:#f0f0f0;" onerror="${imgOnErrorFallback(DEFAULT_RESTAURANT_IMG)}">
        <div class="card-content">
            <div class="card-header">
                <div>
                    <h3>${restaurant.name}</h3>
                    <p class="cuisine">${cuisineText}</p>
                </div>
                <span class="rating">⭐ ${restaurant.rating}</span>
            </div>
            <div class="card-meta">
                <span>🕐 ${deliveryTime} mins</span>
                <span>💰 Min: ₹${restaurant.minOrder}</span>
                <span>🚲 ₹${restaurant.deliveryFee}</span>
            </div>
            ${restaurant.offers ? `<div class="offer">${restaurant.offers}</div>` : ''}
            <button type="button" class="view-menu-btn" data-restaurant-id="${restaurant._id}">View Menu</button>
        </div>
    `;
    card.querySelector('.view-menu-btn').addEventListener('click', () => viewRestaurantDetails(restaurant._id));
    return card;
}

// ===== MealDB Helpers =====
function deterministicPriceFromId(id) {
    const n = Number(String(id || '').replace(/\D/g, '').slice(-3) || '0');
    return 120 + (n % 220);
}

function deterministicAvailabilityFromId(id) {
    const n = Number(String(id || '').replace(/\D/g, '').slice(-2) || '1');
    return n % 5 !== 0;
}

function inferVegFromMealName(name) {
    const text = String(name || '').toLowerCase();
    const nonVegWords = ['chicken', 'beef', 'pork', 'lamb', 'fish', 'prawn', 'shrimp', 'mutton', 'turkey', 'ham'];
    return !nonVegWords.some(w => text.includes(w));
}

async function fetchMealsByQuery(query) {
    const url = `${PUBLIC_FOOD_API}/search.php?s=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json().catch(() => ({}));
    return Array.isArray(data.meals) ? data.meals : [];
}

async function fetchPublicFoodItems(cuisine = 'all') {
    const key = String(cuisine || 'all');
    const queries = CUISINE_QUERY_MAP[key] || CUISINE_QUERY_MAP.all;
    const results = await Promise.all(queries.map(q => fetchMealsByQuery(q)));
    const meals = results.flat();
    const seen = new Set();
    const items = [];
    meals.forEach(meal => {
        const id = String(meal.idMeal || '');
        if (!id || seen.has(id)) return;
        seen.add(id);
        items.push({
            _id: `public-${id}`,
            name: meal.strMeal || 'Popular Item',
            category: key === 'all' ? (meal.strCategory || 'Popular') : key,
            price: deterministicPriceFromId(id),
            isVeg: inferVegFromMealName(meal.strMeal),
            description: meal.strArea ? `${meal.strArea} style ${meal.strCategory || 'meal'}` : (meal.strCategory || 'Popular item'),
            // Use the MealDB thumbnail directly — it always matches the dish name
            image: meal.strMealThumb || DEFAULT_DISH_IMG,
            restaurantId: `public-${key.toLowerCase().replace(/\s+/g, '-')}`,
            restaurantName: `${key === 'all' ? 'Popular' : key} Specials`,
            isAvailable: deterministicAvailabilityFromId(id),
        });
    });
    return items.slice(0, 12);
}

// ===== Display Featured Items =====
async function displayFeaturedItems(cuisine = 'all') {
    const featuredGrid = document.getElementById('featuredItemsGrid');
    if (!featuredGrid) return;
    featuredGrid.innerHTML = '<p class="loading" style="grid-column:1/-1;text-align:center;">Loading featured dishes…</p>';

    let allItems = [];

    // Build from manual restaurant menus (primary source)
    manualRestaurants.forEach(restaurant => {
        (restaurant.menu || []).forEach(item => {
            allItems.push({
                ...item,
                // Resolve the correct image based on name
                image: resolveDishImage(item),
                restaurantId: restaurant._id,
                restaurantName: restaurant.name,
                restaurantImage: restaurant.image,
                restaurantCuisine: restaurant.cuisine || [],
                isAvailable: true,
            });
        });
    });

    // Filter by cuisine
    const filterKey = String(cuisine || 'all').toLowerCase();
    if (filterKey !== 'all') {
        allItems = allItems.filter(item => itemMatchesCuisine(item, cuisine));
    }

    // Supplement with MealDB API items if not enough
    if (allItems.length < 8) {
        try {
            const publicItems = await fetchPublicFoodItems(cuisine);
            // For API items, the image from MealDB is already correct
            allItems = [...allItems, ...publicItems];
        } catch (_) {}
    }

    // Also always try to add MealDB items for variety (for 'all' filter)
    if (filterKey === 'all' && allItems.length < 16) {
        try {
            const publicItems = await fetchPublicFoodItems('all');
            allItems = [...allItems, ...publicItems];
        } catch (_) {}
    }

    // Deduplicate by name
    const seenNames = new Set();
    allItems = allItems.filter(item => {
        const k = String(item.name || '').toLowerCase();
        if (seenNames.has(k)) return false;
        seenNames.add(k);
        return true;
    });

    allItems = allItems.sort(() => Math.random() - 0.5).slice(0, 12);

    featuredGrid.innerHTML = '';

    if (allItems.length === 0) {
        featuredGrid.innerHTML = '<p class="no-results" style="grid-column:1/-1;text-align:center;">No related food items found for this category.</p>';
        return;
    }

    allItems.forEach(item => {
        const vegIcon = item.isVeg ? '🥬' : '🍗';
        const itemImage = resolveDishImage(item);
        const available = item.isAvailable !== false;
        const itemCard = document.createElement('div');
        itemCard.className = 'featured-item-card';
        itemCard.style.cssText = 'background:white;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);transition:all 0.3s ease;cursor:pointer;';
        itemCard.onmouseover = function () { this.style.transform = 'translateY(-5px)'; this.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)'; };
        itemCard.onmouseout = function () { this.style.transform = 'translateY(0)'; this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'; };

        const itemId = String(item._id);
        const rid = String(item.restaurantId).replace(/'/g, "\\'");
        const rname = String(item.restaurantName).replace(/'/g, "\\'");
        const iname = String(item.name).replace(/'/g, "\\'");
        const iimage = String(itemImage).replace(/'/g, "\\'");
        const addBtnHtml = available
            ? `<button type="button" onclick="addMenuItemToCart('${itemId}','${iname}',${item.price},'${rid}','${rname}','${iimage}')" style="background:#d32f2f;color:white;border:none;padding:8px 15px;border-radius:20px;cursor:pointer;font-weight:bold;transition:0.3s;" onmouseover="this.style.background='#b71c1c'" onmouseout="this.style.background='#d32f2f'">Add</button>`
            : `<button type="button" disabled style="background:#bbb;color:white;border:none;padding:8px 15px;border-radius:20px;cursor:not-allowed;font-weight:bold;">Unavailable</button>`;
        const availabilityHtml = available
            ? '<span style="display:inline-block;margin-top:6px;font-size:11px;font-weight:700;color:#2e7d32;">● Available</span>'
            : '<span style="display:inline-block;margin-top:6px;font-size:11px;font-weight:700;color:#c62828;">● Not Available</span>';

        itemCard.innerHTML = `
            <img src="${itemImage}" alt="${item.name}" style="width:100%;height:180px;object-fit:cover;background:#f0f0f0;" onerror="${imgOnErrorFallback(DEFAULT_DISH_IMG)}">
            <div style="padding:15px;">
                <p style="margin:0;font-size:12px;color:#d32f2f;font-weight:bold;">${item.restaurantName}</p>
                <h4 style="margin:8px 0;color:#333;font-size:15px;">${vegIcon} ${item.name}</h4>
                <p style="margin:8px 0;color:#666;font-size:12px;">${item.description || ''}</p>
                ${availabilityHtml}
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;">
                    <span style="font-weight:bold;color:#d32f2f;font-size:16px;">₹${item.price}</span>
                    ${addBtnHtml}
                </div>
            </div>
        `;
        featuredGrid.appendChild(itemCard);
    });
}

// ===== View Restaurant Details =====
async function viewRestaurantDetails(restaurantId) {
    try {
        let restaurant = restaurants.find(r => String(r._id) === String(restaurantId));
        if (!restaurant) {
            const response = await fetch(`${API_URL}/restaurants/${restaurantId}`);
            if (response.ok) restaurant = await response.json();
            else throw new Error('Restaurant not found');
        }
        currentRestaurant = restaurant;
        let menuItems = [];
        try {
            const menuResponse = await fetch(`${API_URL}/menu/restaurant/${restaurantId}`);
            if (menuResponse.ok) menuItems = await menuResponse.json();
        } catch (e) {
            menuItems = restaurant.menu || [];
        }
        if (!menuItems || menuItems.length === 0) menuItems = restaurant.menu || [];
        showRestaurantModal(currentRestaurant, menuItems);
    } catch (error) {
        showNotification('Failed to load menu. Please try again.');
    }
}

// ===== Show Restaurant Modal =====
function showRestaurantModal(restaurant, menuItems) {
    let modal = document.getElementById('restaurantDetailModal');
    if (!modal) { modal = document.createElement('div'); modal.id = 'restaurantDetailModal'; modal.className = 'modal'; document.body.appendChild(modal); }
    const deliveryTime = restaurant.deliveryTime || 30;
    const headerImg = restaurantImageUrl(restaurant.image);
    const cuisineLine = (restaurant.cuisine || []).join(', ');
    let menuHTML = '';
    const categories = {};
    menuItems.forEach(item => {
        if (!categories[item.category]) categories[item.category] = [];
        categories[item.category].push(item);
    });
    Object.entries(categories).forEach(([category, items]) => {
        menuHTML += `<h4 style="margin-top:20px;margin-bottom:15px;color:#d32f2f;border-bottom:2px solid #d32f2f;padding-bottom:10px;">${category}</h4>`;
        items.forEach(item => {
            const vegIcon = item.isVeg ? '🥬' : '🍗';
            // Use resolveDishImage for correct picture
            const itemImage = resolveDishImage(item);
            const safeImg = String(itemImage).replace(/'/g, "\\'");
            const safeName = String(item.name || '').replace(/'/g, "\\'");
            menuHTML += `
                <div class="menu-item" style="display:flex;gap:15px;padding:15px;border:1px solid #eee;border-radius:8px;margin-bottom:10px;background:#fafafa;">
                    <img src="${itemImage}" alt="${item.name}" style="width:120px;height:100px;object-fit:cover;border-radius:8px;background:#e0e0e0;flex-shrink:0;" onerror="${imgOnErrorFallback(DEFAULT_DISH_IMG)}">
                    <div style="flex:1;">
                        <p style="margin:0;font-weight:600;font-size:15px;">${vegIcon} ${item.name}</p>
                        <p style="margin:5px 0;font-size:12px;color:#666;">${item.description || ''}</p>
                        <p style="margin:10px 0 0;font-weight:bold;color:#d32f2f;font-size:16px;">₹${item.price}</p>
                    </div>
                    <button class="add-item-btn" onclick="addMenuItemToCart('${item._id}','${safeName}',${item.price},'${restaurant._id}','${restaurant.name}','${safeImg}')" style="background:#d32f2f;color:white;border:none;padding:8px 15px;border-radius:50%;width:50px;height:50px;font-size:20px;cursor:pointer;transition:all 0.3s;flex-shrink:0;" onmouseover="this.style.background='#b71c1c'" onmouseout="this.style.background='#d32f2f'">+</button>
                </div>
            `;
        });
    });

    modal.innerHTML = `
        <div class="modal-content" style="max-width:700px;max-height:90vh;overflow-y:auto;padding:30px 20px;padding-top:40px;background:white;border-radius:12px;position:relative;box-shadow:0 10px 40px rgba(0,0,0,0.3);">
            <button class="close-modal-btn" onclick="closeRestaurantModal()" style="position:absolute;top:10px;right:10px;background:#f0f0f0;border:none;font-size:24px;cursor:pointer;width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;">✕</button>
            <img src="${headerImg}" alt="${restaurant.name}" style="width:100%;height:250px;object-fit:cover;border-radius:8px;margin-bottom:20px;" onerror="${imgOnErrorFallback(DEFAULT_RESTAURANT_IMG)}">
            <h2 style="margin:15px 0 5px;color:#333;font-size:24px;">${restaurant.name}</h2>
            <p style="margin:0 0 15px;color:#666;font-size:14px;">${cuisineLine}</p>
            <p style="margin:0 0 15px;color:#999;font-size:13px;">${restaurant.address || 'Address not available'}</p>
            <div style="display:flex;gap:10px;margin:15px 0;padding:15px;background:#f5f5f5;border-radius:8px;flex-wrap:wrap;">
                <span>⭐ ${restaurant.rating} Rating</span>
                <span>🕐 ${deliveryTime} mins</span>
                <span>💰 Min ₹${restaurant.minOrder}</span>
                <span>🚲 ₹${restaurant.deliveryFee}</span>
            </div>
            <div id="menuContainer" style="margin-top:20px;">${menuHTML || '<p style="text-align:center;color:#999;">No menu items available</p>'}</div>
        </div>
    `;
    modal.style.cssText = 'display:flex;position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,0.5);z-index:2000;align-items:center;justify-content:center;overflow-y:auto;';
}

function closeRestaurantModal() {
    const modal = document.getElementById('restaurantDetailModal');
    if (modal) modal.style.display = 'none';
}

document.addEventListener('click', function (event) {
    const modal = document.getElementById('restaurantDetailModal');
    if (modal && event.target === modal) closeRestaurantModal();
});

// ===== Add Menu Item to Cart =====
function addMenuItemToCart(itemId, itemName, price, restaurantId, restaurantName, itemImage = '') {
    // Allow items from multiple restaurants - no restriction
    const existingItem = cart.find(item => item.menuItemId === itemId && item.restaurantId === restaurantId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        const restaurant = restaurants.find(r => r._id === restaurantId);
        // Resolve best image: prefer the one passed in, then look up by name
        const resolvedImage = validImageUrl(itemImage) ? itemImage : (DISH_IMAGE_MAP[String(itemName || '').toLowerCase().trim()] || DEFAULT_DISH_IMG);
        cart.push({
            menuItemId: itemId,
            name: itemName,
            price,
            quantity: 1,
            image: resolvedImage,
            restaurantId,
            restaurantName: restaurantName || restaurant?.name || 'Restaurant',
            restaurantImage: restaurant?.image || '',
            description: 'Item from ' + (restaurantName || restaurant?.name || 'Restaurant'),
        });
    }
    saveCartToStorage();
    updateCartDisplay();
    showNotification(`${itemName} added to cart!`);
}

// ===== Update Cart Display =====
function updateCartDisplay() {
    const totals = computeCartTotals();
    cartCount.textContent = String(totals.itemCount);
    cartItems.innerHTML = '';

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div style="padding:40px 20px;text-align:center;color:#999;">
                <div style="font-size:48px;margin-bottom:15px;">🛒</div>
                <h3 style="margin:0 0 10px;color:#666;">Your cart is empty</h3>
                <p style="margin:0;font-size:13px;">Browse restaurants and add items to get started</p>
            </div>
        `;
        syncCartFooter({ subtotal: 0, gst: 0, gstPct: 5, platformFee: 0, delivery: 0, restaurantDelivery: 0, grandTotal: 0, itemCount: 0, minOrder: 0, minOrderGap: 0, freeDeliveryGap: 0 });
        return;
    }

    // Group items by restaurant
    const itemsByRestaurant = {};
    cart.forEach((item, index) => {
        const restaurantId = item.restaurantId;
        if (!itemsByRestaurant[restaurantId]) {
            itemsByRestaurant[restaurantId] = {
                restaurantName: item.restaurantName,
                restaurantImage: item.restaurantImage,
                items: []
            };
        }
        itemsByRestaurant[restaurantId].items.push({ ...item, originalIndex: index });
    });

    // Display items grouped by restaurant
    Object.entries(itemsByRestaurant).forEach(([restaurantId, restaurantData]) => {
        const restaurantHeader = document.createElement('div');
        restaurantHeader.style.cssText = 'padding:12px 15px;background:linear-gradient(135deg,#d32f2f,#ff5722);margin-bottom:15px;border-radius:6px;font-weight:bold;display:flex;align-items:center;gap:12px;color:white;';
        restaurantHeader.innerHTML = `
            <img src="${restaurantImageUrl(restaurantData.restaurantImage)}" alt="" style="width:45px;height:45px;border-radius:6px;object-fit:cover;border:2px solid white;" onerror="${imgOnErrorFallback(DEFAULT_RESTAURANT_IMG)}">
            <div style="flex:1;"><div style="font-size:13px;opacity:0.9;">From</div><div style="font-size:16px;">${restaurantData.restaurantName}</div></div>
        `;
        cartItems.appendChild(restaurantHeader);

        restaurantData.items.forEach((item) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.style.cssText = 'display:flex;gap:10px;padding:12px;border-bottom:1px solid #f0f0f0;';
            const itemImage = resolveDishImage(item);
            itemElement.innerHTML = `
                <img src="${itemImage}" alt="${item.name}" style="width:50px;height:50px;border-radius:6px;object-fit:cover;" onerror="${imgOnErrorFallback(DEFAULT_DISH_IMG)}">
                <div style="flex:1;">
                    <h4 style="margin:0;font-size:14px;font-weight:600;color:#333;">${item.name}</h4>
                    <p style="margin:4px 0 0;color:#d32f2f;font-weight:600;font-size:13px;">₹${item.price} each</p>
                    <p style="margin:2px 0 0;color:#999;font-size:12px;">Total: ₹${item.price * item.quantity}</p>
                </div>
                <div class="cart-item-controls" style="display:flex;align-items:center;gap:4px;background:#f5f5f5;border-radius:4px;padding:4px;">
                    <button type="button" onclick="changeQuantity(${item.originalIndex},-1)" style="width:28px;height:28px;border:none;background:white;color:#d32f2f;cursor:pointer;border-radius:3px;font-weight:bold;font-size:16px;">−</button>
                    <span style="min-width:30px;text-align:center;font-weight:700;color:#333;">${item.quantity}</span>
                    <button type="button" onclick="changeQuantity(${item.originalIndex},1)" style="width:28px;height:28px;border:none;background:white;color:#d32f2f;cursor:pointer;border-radius:3px;font-weight:bold;font-size:16px;">+</button>
                </div>
                <button type="button" onclick="removeFromCart(${item.originalIndex})" style="background:none;border:none;color:#999;cursor:pointer;padding:0 8px;font-size:18px;" title="Remove">✕</button>
            `;
            cartItems.appendChild(itemElement);
        });
    });

    const delLabel = totals.delivery === 0 && totals.subtotal > 0 ? '<span style="color:#2e7d32;font-weight:700;">FREE</span>' : '₹' + totals.delivery;
    const summary = document.createElement('div');
    summary.style.cssText = 'padding:15px;background:linear-gradient(135deg,#f5f5f5,#fafafa);margin-top:15px;border-radius:8px;font-size:13px;border:1px solid #e0e0e0;';
    summary.innerHTML = `
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid #e0e0e0;"><span style="color:#666;">Item total</span><span style="font-weight:600;">₹${totals.subtotal}</span></div>
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid #e0e0e0;"><span style="color:#666;">GST (${totals.gstPct}%)</span><span style="font-weight:600;">₹${totals.gst}</span></div>
        <div style="display:flex;justify-content:space-between;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid #e0e0e0;"><span style="color:#666;">Platform fee</span><span style="font-weight:600;">₹${totals.platformFee}</span></div>
        <div style="display:flex;justify-content:space-between;margin-bottom:12px;padding-bottom:12px;border-bottom:2px solid #e0e0e0;"><span style="color:#666;">Delivery</span><span style="font-weight:600;">${delLabel}</span></div>
        <div style="display:flex;justify-content:space-between;font-weight:bold;font-size:15px;color:#d32f2f;background:white;padding:10px 12px;border-radius:6px;"><span>💰 Amount to pay</span><span>₹${totals.grandTotal}</span></div>
    `;
    cartItems.appendChild(summary);

    const cartActions = document.createElement('div');
    cartActions.style.cssText = 'display:flex;gap:8px;margin-top:12px;';
    cartActions.innerHTML = `
        <button type="button" onclick="clearCart()" style="flex:1;padding:10px;background:#fff;color:#d32f2f;border:1px solid #d32f2f;border-radius:8px;cursor:pointer;font-weight:600;">Clear cart</button>
        <button type="button" onclick="toggleCart()" style="flex:1;padding:10px;background:#f3f3f3;color:#444;border:1px solid #ddd;border-radius:8px;cursor:pointer;font-weight:600;">Continue browsing</button>
    `;
    cartItems.appendChild(cartActions);

    syncCartFooter(totals);

    const checkoutBtn = document.createElement('button');
    checkoutBtn.type = 'button';
    checkoutBtn.innerHTML = '<i class="fas fa-credit-card"></i> Proceed to checkout';
    checkoutBtn.style.cssText = 'width:100%;padding:14px;margin-top:15px;background:linear-gradient(135deg,#d32f2f,#ff5722);color:white;border:none;border-radius:8px;cursor:pointer;font-weight:bold;font-size:15px;';
    checkoutBtn.onclick = () => openCheckoutModal();
    cartItems.appendChild(checkoutBtn);
}

function clearCart() {
    if (!cart.length) return;
    if (!confirm('Clear all items from your cart?')) return;
    cart = [];
    saveCartToStorage();
    updateCartDisplay();
    showNotification('Cart cleared');
}

function changeQuantity(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    saveCartToStorage();
    updateCartDisplay();
}

function removeFromCart(index) {
    showNotification(`${cart[index].name} removed from cart`);
    cart.splice(index, 1);
    saveCartToStorage();
    updateCartDisplay();
}

function saveCartToStorage() { localStorage.setItem('cart', JSON.stringify(cart)); }
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) { try { cart = JSON.parse(savedCart); } catch (e) { cart = []; } }
}

// ===== Checkout Modal =====
function openCheckoutModal() {
    if (cart.length === 0) { showNotification('Your cart is empty!'); return; }
    let modal = document.getElementById('checkoutModal');
    if (!modal) { modal = document.createElement('div'); modal.id = 'checkoutModal'; modal.className = 'modal checkout-modal'; modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true'); modal.setAttribute('aria-labelledby', 'checkoutTitle'); document.body.appendChild(modal); }
    modal.classList.remove('hidden');
    const t = computeCartTotals();

    // Group items by restaurant for display
    const restaurantGroups = {};
    cart.forEach(item => {
        if (!restaurantGroups[item.restaurantName]) {
            restaurantGroups[item.restaurantName] = [];
        }
        restaurantGroups[item.restaurantName].push(item);
    });

    const restaurantNames = Object.keys(restaurantGroups);
    const restaurantLine = restaurantNames.length === 1
        ? escapeHtml(restaurantNames[0])
        : `${restaurantNames.length} restaurants`;

    const deliveryHtml = (t.subtotal > 0 && t.delivery === 0)
        ? '<span class="checkout-bill-value checkout-bill-value--free">FREE</span>'
        : '<span class="checkout-bill-value">₹' + t.delivery + '</span>';

    modal.innerHTML = `
        <div class="modal-content checkout-modal-card">
            <button type="button" class="close-modal-btn" onclick="closeCheckoutModal()" aria-label="Close checkout">✕</button>
            <header class="checkout-head"><h2 id="checkoutTitle">Checkout</h2><p class="checkout-sub">Ordering from <strong>${restaurantLine}</strong></p></header>
            <form id="checkoutForm" class="checkout-form">
                <section class="checkout-section"><h3 class="checkout-section-title">Delivery details</h3>
                    <div class="checkout-field"><label class="checkout-label" for="checkoutName">Full name</label><input class="checkout-input" id="checkoutName" type="text" name="name" required autocomplete="name" placeholder="Name on the order"></div>
                    <div class="checkout-field"><label class="checkout-label" for="checkoutPhone">Phone</label><input class="checkout-input" id="checkoutPhone" type="tel" name="phone" required pattern="[0-9]{10}" inputmode="numeric" maxlength="10" autocomplete="tel" placeholder="9876543210"></div>
                    <div class="checkout-field"><label class="checkout-label" for="checkoutAddress">Delivery address</label><textarea class="checkout-textarea" id="checkoutAddress" name="address" required rows="3" placeholder="Flat, street, landmark"></textarea></div>
                </section>
                <section class="checkout-section"><h3 class="checkout-section-title">Payment</h3>
                    <div class="checkout-field"><label class="checkout-label" for="checkoutPayment">Payment method</label>
                        <select class="checkout-select" id="checkoutPayment" name="paymentMethod" required><option value="">Choose a method</option><option value="card">Card</option><option value="upi">UPI</option><option value="cash">Cash on delivery</option></select>
                    </div>
                </section>
                <section class="checkout-section"><h3 class="checkout-section-title">Bill summary</h3>
                    <div class="checkout-bill">
                        <div class="checkout-bill-row"><span class="checkout-bill-label">Item total</span><span class="checkout-bill-value">₹${t.subtotal}</span></div>
                        <div class="checkout-bill-row"><span class="checkout-bill-label">GST (${t.gstPct}%)</span><span class="checkout-bill-value">₹${t.gst}</span></div>
                        <div class="checkout-bill-row"><span class="checkout-bill-label">Platform fee</span><span class="checkout-bill-value">₹${t.platformFee}</span></div>
                        <div class="checkout-bill-row"><span class="checkout-bill-label">Delivery</span>${deliveryHtml}</div>
                        <div class="checkout-bill-row checkout-bill-row--total"><span class="checkout-bill-label">To pay</span><span class="checkout-bill-value">₹${t.grandTotal}</span></div>
                    </div>
                </section>
                <div class="checkout-field"><label class="checkout-label" for="checkoutNotes">Notes <span class="optional">optional</span></label><textarea class="checkout-textarea checkout-textarea--compact" id="checkoutNotes" name="notes" rows="2" placeholder="e.g. Ring the bell, leave at gate"></textarea></div>
                <button type="submit" class="checkout-submit-btn">Place order · ₹${t.grandTotal}</button>
            </form>
        </div>
    `;
    modal.style.display = 'flex';
    modal.onclick = function (e) { if (e.target === modal) closeCheckoutModal(); };
    modal.querySelector('.checkout-modal-card')?.addEventListener('click', e => e.stopPropagation());
    modal.querySelector('#checkoutForm')?.addEventListener('submit', handleCheckout);
}

function closeCheckoutModal() { const m = document.getElementById('checkoutModal'); if (m) { m.style.display = 'none'; m.classList.add('hidden'); } }
function closeCheckout() { closeCheckoutModal(); }
function toggleCheckout() { const m = document.getElementById('checkoutModal'); if (m) { const hidden = m.style.display === 'none' || !m.style.display; m.style.display = hidden ? 'flex' : 'none'; } }

// ===== Handle Checkout =====
async function handleCheckout(e) {
    e.preventDefault();
    if (cart.length === 0) { showNotification('Your cart is empty!'); return; }
    const formData = new FormData(e.target);
    const address = document.getElementById('checkoutAddress')?.value || document.getElementById('deliveryAddress')?.value || formData.get('address') || '';
    const phone = document.getElementById('checkoutPhone')?.value || document.getElementById('phoneNumber')?.value || formData.get('phone') || '';
    const paymentMethod = document.getElementById('checkoutPayment')?.value || document.getElementById('paymentMethod')?.value || formData.get('paymentMethod') || 'card';
    const notes = document.getElementById('checkoutNotes')?.value || document.getElementById('notes')?.value || formData.get('notes') || '';
    if (!address || !phone) { showNotification('Please enter delivery address and phone number'); return; }

    const authToken = localStorage.getItem('foodHubToken');
    const tokenHeader = authToken && !authToken.startsWith('demo_token_') ? { 'Authorization': 'Bearer ' + authToken } : {};

    // Group items by restaurant
    const restaurantGroups = {};
    cart.forEach(item => {
        if (!restaurantGroups[item.restaurantId]) {
            restaurantGroups[item.restaurantId] = {
                restaurantId: item.restaurantId,
                restaurantName: item.restaurantName,
                items: []
            };
        }
        restaurantGroups[item.restaurantId].items.push({
            menuItemId: item.menuItemId,
            name: item.name,
            price: item.price,
            quantity: item.quantity
        });
    });

    const restaurantIds = Object.keys(restaurantGroups);
    const orderIds = [];
    let hasErrors = false;

    try {
        // Place separate orders for each restaurant
        for (const restaurantId of restaurantIds) {
            const restaurantData = restaurantGroups[restaurantId];
            const orderData = {
                restaurantId: restaurantData.restaurantId,
                restaurantName: restaurantData.restaurantName,
                items: restaurantData.items,
                deliveryAddress: { street: address, coordinates: { latitude: userLocation.lat, longitude: userLocation.lng } },
                paymentMethod,
                notes,
                customerPhone: phone,
                totalAmount: computeRestaurantTotal(restaurantData.items)
            };

            try {
                const response = await fetch(`${API_URL}/order`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', ...tokenHeader },
                    body: JSON.stringify(orderData)
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Failed to place order');
                }

                const result = await response.json();
                orderIds.push(result._id);
            } catch (error) {
                console.error(`Failed to place order for ${restaurantData.restaurantName}:`, error);
                hasErrors = true;
                showNotification(`❌ Failed to place order for ${restaurantData.restaurantName}: ${error.message}`);
            }
        }

        if (orderIds.length > 0) {
            closeCheckout();
            cart = [];
            saveCartToStorage();
            updateCartDisplay();

            if (hasErrors) {
                showNotification(`⚠️ Some orders placed successfully. Order IDs: ${orderIds.join(', ')}`);
            } else {
                showNotification(`✓ All orders placed! IDs: ${orderIds.join(', ')}`);
            }

            const message = hasErrors
                ? `✅ Orders placed successfully!\n\nOrder IDs: ${orderIds.join(', ')}\n\nNote: Some orders may have failed.`
                : `✅ All orders placed successfully!\n\nOrder IDs: ${orderIds.join(', ')}\n\nEstimated Delivery: 30-45 minutes`;

            alert(message);
        } else {
            showNotification('❌ Failed to place any orders');
        }

    } catch (error) {
        showNotification('❌ Failed to place orders: ' + error.message);
    }
}

// ===== Filter / Search =====
function filterByCuisine(cuisine) {
    currentFilter = cuisine;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if ((btn.dataset.cuisine || '').toLowerCase() === (cuisine || '').toLowerCase()) btn.classList.add('active');
    });
    renderRestaurants();
    displayFeaturedItems(cuisine);
}

function searchRestaurants() {
    const query = (document.getElementById('searchInput')?.value || '').trim().toLowerCase();
    if (!query) { renderRestaurants(); return; }
    const filteredRestaurants = restaurants.filter(r =>
        r.name.toLowerCase().includes(query) ||
        (r.cuisine || []).some(c => c.toLowerCase().includes(query)) ||
        (r.menu || []).some(item => String(item.name || '').toLowerCase().includes(query))
    );
    restaurantGrid.innerHTML = '';
    if (filteredRestaurants.length === 0) { restaurantGrid.innerHTML = '<p class="no-results">No restaurants found matching your search.</p>'; return; }
    filteredRestaurants.forEach(restaurant => restaurantGrid.appendChild(createRestaurantCard(restaurant)));
}

function toggleCart() { cartSidebar.classList.toggle('open'); }
function toggleMobileMenu() { document.querySelector('.nav-links')?.classList.toggle('active'); }

// ===== Location =====
async function reverseGeocodeLocation(lat, lng) {
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`, { headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error();
        const data = await res.json();
        const address = data.address || {};
        const area = address.suburb || address.neighbourhood || address.city_district || address.city || address.town || address.village;
        return [area, address.state || ''].filter(Boolean).join(', ');
    } catch (_) { return ''; }
}

async function applyDetectedLocation(position) {
    userLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
    if (map) map.setCenter(userLocation);
    locationText.textContent = '📍 Detecting your area...';
    const readable = await reverseGeocodeLocation(userLocation.lat, userLocation.lng);
    locationText.textContent = readable ? `📍 Showing restaurants near ${readable}` : '📍 Showing restaurants near your current location';
}

function getLocation() {
    if (!navigator.geolocation) { locationText.textContent = '📍 Showing restaurants near Vignan University'; return; }
    navigator.geolocation.getCurrentPosition(
        async pos => { await applyDetectedLocation(pos); },
        () => { locationText.textContent = '📍 Showing restaurants near Vignan University'; },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
}

function openLocationModal() {
    const existing = document.getElementById('locationModalOverlay');
    if (existing) existing.remove();
    const modal = document.createElement('div');
    modal.id = 'locationModalOverlay';
    modal.className = 'app-sheet-modal';
    modal.innerHTML = `
        <div class="sheet" style="max-width:420px;">
            <button type="button" class="sheet-close" aria-label="Close">&times;</button>
            <h2 style="margin-bottom:0.5rem;">Change Location</h2>
            <p style="color:#666;margin:0 0 1rem;">Select your preferred area</p>
            <input type="text" id="locationInput" placeholder="Enter area name..." style="width:100%;padding:10px;border:1px solid #ddd;border-radius:8px;margin-bottom:12px;">
            <div style="display:flex;gap:10px;justify-content:flex-end;">
                <button type="button" id="detectLocationBtn" style="background:#2e7d32;color:#fff;padding:10px 14px;border:none;border-radius:8px;cursor:pointer;">Use Current Location</button>
                <button type="button" id="saveAreaBtn" style="background:#d32f2f;color:#fff;padding:10px 14px;border:none;border-radius:8px;cursor:pointer;">Save Area</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    const close = () => modal.remove();
    modal.querySelector('.sheet-close')?.addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });
    modal.querySelector('#detectLocationBtn')?.addEventListener('click', () => { getCurrentLocation(); close(); });
    modal.querySelector('#saveAreaBtn')?.addEventListener('click', () => {
        const area = document.getElementById('locationInput')?.value?.trim();
        if (!area) { showNotification('Please enter an area'); return; }
        locationText.textContent = `📍 Showing restaurants near ${area}`;
        close();
    });
}

function getCurrentLocation() {
    if (!navigator.geolocation) { showNotification('Location not supported'); return; }
    navigator.geolocation.getCurrentPosition(async pos => { await applyDetectedLocation(pos); loadRestaurants(); }, () => { showNotification('Could not access your location'); }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
}

function navSearch() {
    const query = (document.getElementById('navSearchInput')?.value || '').trim().toLowerCase();
    if (!query) { showNotification('Please enter a search term'); return; }
    document.getElementById('restaurants')?.scrollIntoView({ behavior: 'smooth' });
    const mainInput = document.getElementById('searchInput');
    if (mainInput) mainInput.value = query;
    searchRestaurants();
    showNotification(`Showing results for: ${query}`);
}

function checkout() { openCheckoutModal(); }
function placeOrder(e) { handleCheckout(e); }
function applyOffer() { showNotification('Special offers are shown on each restaurant card. Order to save!'); }

function showNotification(message) {
    const n = document.createElement('div');
    n.className = 'notification';
    n.textContent = message;
    n.style.cssText = 'position:fixed;bottom:20px;right:20px;background:linear-gradient(135deg,#d32f2f,#ff5722);color:white;padding:15px 20px;border-radius:4px;box-shadow:0 2px 10px rgba(0,0,0,0.2);z-index:10000;animation:slideInUp 0.3s ease;';
    document.body.appendChild(n);
    setTimeout(() => { n.style.animation = 'slideOutDown 0.3s ease'; setTimeout(() => { if (n.parentNode) n.parentNode.removeChild(n); }, 300); }, 3000);
}