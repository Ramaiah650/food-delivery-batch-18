const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');

const STATUS_FLOW = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'];

function isObjectIdLike(value) {
  return typeof value === 'string' && /^[a-f\d]{24}$/i.test(value);
}

const placeOrder = async (req, res) => {
  try {
    const { items, restaurantId, restaurantName, deliveryAddress, paymentMethod, notes, customerPhone } = req.body;
    const userId = req.user?._id || null;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }

    // Validate restaurant (supports fallback/manual mode too)
    let restaurant = null;
    if (restaurantId && isObjectIdLike(String(restaurantId))) {
      restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }
    }

    let subtotal = 0;
    const orderItems = [];

    // Calculate total price and validate items (graceful for non-DB demo items)
    for (const item of items) {
      const qty = Math.max(1, Number(item.quantity) || 1);
      const menuItemId = String(item.menuItemId || '');
      const hasDbItemId = isObjectIdLike(menuItemId);
      let menuItem = null;

      if (hasDbItemId) {
        menuItem = await MenuItem.findById(menuItemId);
        if (!menuItem) {
          return res.status(404).json({ message: `Menu item ${menuItemId} not found` });
        }
      }

      const unitPrice = menuItem ? Number(menuItem.price) : Number(item.price);
      if (!Number.isFinite(unitPrice) || unitPrice < 0) {
        return res.status(400).json({ message: `Invalid price for item ${item.name || menuItemId}` });
      }

      const itemTotal = unitPrice * qty;
      subtotal += itemTotal;
      orderItems.push({
        menuItemId: hasDbItemId ? menuItemId : undefined,
        name: menuItem ? menuItem.name : (item.name || 'Item'),
        price: unitPrice,
        quantity: qty
      });
    }

    const FREE_DELIVERY_MIN = 300;
    const tax = Math.round(subtotal * 0.05);
    const platformFee = subtotal > 0 ? 2 : 0;
    const deliveryFee =
      subtotal >= FREE_DELIVERY_MIN ? 0 : (restaurant?.deliveryFee ?? 40);
    const discount = 0;
    const totalPrice = subtotal + tax + platformFee + deliveryFee - discount;

    const payload = {
      userId,
      items: orderItems,
      subtotal,
      tax,
      platformFee,
      deliveryFee,
      discount,
      totalPrice,
      deliveryAddress,
      paymentMethod: paymentMethod || 'card',
      notes,
      customerPhone: customerPhone || (req.user ? req.user.phone : '') || '',
      restaurantName: restaurant?.name || restaurantName || 'Restaurant'
    };
    if (restaurant?._id) {
      payload.restaurantId = restaurant._id;
    }

    const order = new Order(payload);

    await order.save();
    await order.populate('restaurantId userId', 'name email phone');

    res.status(201).json(order);
  } catch (error) {
    console.error('Order placement error:', error);
    res.status(500).json({ message: 'Error placing order', error: error.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.id })
      .populate('restaurantId')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getDeliveryOrders = async (req, res) => {
  try {
    const statuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery'];
    const orders = await Order.find({ status: { $in: statuses } })
      .populate('userId', 'name phone')
      .populate('restaurantId', 'name')
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const assignDeliveryPartner = async (req, res) => {
  try {
    const { partnerName, partnerPhone } = req.body;
    if (!partnerName) {
      return res.status(400).json({ message: 'partnerName is required' });
    }
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.status === 'delivered' || order.status === 'cancelled') {
      return res.status(400).json({ message: 'Order is already closed' });
    }
    order.deliveryPartner = {
      name: String(partnerName).trim(),
      phone: String(partnerPhone || '').trim(),
      assignedAt: new Date()
    };
    if (order.status === 'pending') {
      order.status = 'confirmed';
    }
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const progressDeliveryOrder = async (req, res) => {
  try {
    const { action } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.status === 'cancelled' || order.status === 'delivered') {
      return res.status(400).json({ message: 'Order cannot be updated' });
    }
    let next = order.status;
    if (action === 'next') {
      const idx = STATUS_FLOW.indexOf(order.status);
      next = idx >= 0 && idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : order.status;
    } else if (action === 'pickup') {
      next = 'out_for_delivery';
    } else if (action === 'delivered') {
      next = 'delivered';
    } else {
      return res.status(400).json({ message: 'Unsupported action' });
    }
    order.status = next;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('restaurantId')
      .populate('items.menuItemId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('restaurantId');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (['delivered', 'out_for_delivery'].includes(order.status)) {
      return res.status(400).json({ message: 'Cannot cancel this order' });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  placeOrder,
  getUserOrders,
  getDeliveryOrders,
  assignDeliveryPartner,
  progressDeliveryOrder,
  getOrderById,
  updateOrderStatus,
  cancelOrder
};