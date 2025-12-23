
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'controllers/authController.js',
  'controllers/foodController.js',
  'controllers/userController.js',
  'models/userModel.js',
  'models/foodModel.js',
  'models/claimModel.js',
  'middleware/authMiddleware.js',
  'routes/authRoutes.js',
  'routes/foodRoutes.js',
  'routes/userRoutes.js',
  'config/database.js',
  '.env',
  'server.js'
];

console.log('🔍 Checking required files...\n');

let allExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allExist = false;
  }
});

console.log('\n' + (allExist ? '🎉 All files present!' : '⚠️  Some files are missing.'));