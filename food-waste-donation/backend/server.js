const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const foodRoutes = require('./routes/foodRoutes');
const requestRoutes = require('./routes/requestRoutes');

app.use('/api', authRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/requests', requestRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'FoodShare API Running' });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log('MongoDB connection error:', error.message);
  });
