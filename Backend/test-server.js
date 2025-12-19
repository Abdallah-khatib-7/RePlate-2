// test-server.js
const express = require('express');
const app = express();

// Simple test route
app.get('/test', (req, res) => {
  res.json({ message: 'Test working' });
});

// Try to import foodController
try {
  const foodController = require('./controllers/foodController');
  console.log('✅ foodController imported successfully');
} catch (error) {
  console.error('❌ Failed to import foodController:', error.message);
}

app.listen(5001, () => {
  console.log('Test server on port 5001');
});