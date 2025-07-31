const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const admin = require('../../firebaseAdmin'); // import it at the top

// Create a new order
router.post('/', async (req, res) => {
  try {
    const { id, products, totalAmount, timestamp, name, phone, address, discount, delivery } = req.body;
    const newOrder = new Order({ id, products, totalAmount, timestamp, name, phone, address, discount, delivery  });

    await newOrder.save();
   // ✅ Send FCM Notification (example using a topic or token)
 const message = {
  notification: {
    title: 'New Order Received',
    body: `Order from ${name || 'Unknown'} - ₹${totalAmount}`,
    sound: 'notify', // custom sound name (without .mp3)
  },
  android: {
    notification: {
      sound: 'notify',
      channel_id: 'order-alerts-v2', // must match the channel created in the app
    },
  },
  topic: 'orders',
};


    await admin.messaging().send(message);

    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Order creation or FCM error:', error);
    res.status(500).json({ message: 'Failed to create order', error });
  }
});

// Fetch all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error });
  }
});

// Test route for orders
router.get('/test', (req, res) => {
    res.status(200).send('Orders test route working');
  });  
  

  // Delete an order
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const deletedOrder = await Order.findOneAndDelete({ id });
  
      if (!deletedOrder) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      res.status(200).json({ message: 'Order deleted successfully', deletedOrder });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete order', error });
    }
  });

  module.exports = router;
