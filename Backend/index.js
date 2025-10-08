const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const auth = require('./middleware/auth');
require('dotenv').config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
// app.use(auth);

// Routes
app.use('/api/auth', require('./routes/userRoute'));
app.use('/api/vault', require('./routes/PasswordRoute')); // Add this line

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Password Vault API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

// Handle 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});