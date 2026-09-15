const express = require('express');
const Request = require('../models/Request');
const Food = require('../models/Food');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { foodId, receiverEmail, requestedDate, status } = req.body;

    if (!foodId || !receiverEmail || !requestedDate) {
      return res.status(400).json({ message: 'Food ID, receiver email and date are required' });
    }

    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }

    if (food.status === 'Requested') {
      return res.status(400).json({ message: 'Food is already requested' });
    }

    const request = new Request({
      foodId,
      receiverEmail,
      requestedDate,
      status: status || 'Requested'
    });

    await request.save();

    food.status = 'Requested';
    await food.save();

    res.status(201).json({ message: 'Food requested successfully', request });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });

    const foodMap = {};
    const foods = await Food.find();
    foods.forEach(food => {
      foodMap[food._id] = food;
    });

    const enrichedRequests = requests.map(request => {
      const food = foodMap[request.foodId.toString()];
      return {
        ...request.toObject(),
        foodName: food ? food.foodName : 'Food not found'
      };
    });

    res.json(enrichedRequests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
