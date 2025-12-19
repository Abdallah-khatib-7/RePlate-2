// backend/test-register.js
const request = require('supertest');
const app = require('./server'); // Make sure server.js exports app

async function test() {
  console.log('🧪 Testing registration API...');
  
  try {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'api-test@example.com',
        password: 'test123',
        full_name: 'API Test User',
        user_type: 'recipient'
      })
      .set('Content-Type', 'application/json');
    
    console.log('Status:', response.status);
    console.log('Response:', response.body);
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

// First, let's make server.js export the app