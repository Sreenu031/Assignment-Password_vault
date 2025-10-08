const express = require('express');
const router = express.Router();

// Debug: Check what's being imported
const controllerFunctions = require('../controllers/passwordController');
console.log('Imported functions:', controllerFunctions);
console.log('getPasswords:', typeof controllerFunctions.getPasswords);
console.log('createPassword:', typeof controllerFunctions.createPassword);

const {
  getPasswords,
  createPassword,
  updatePassword,
  deletePassword,
  getPassword
} = controllerFunctions;

const auth = require('../middleware/auth');

// Debug: Check individual functions
console.log('getPasswords type:', typeof getPasswords);
console.log('createPassword type:', typeof createPassword);
console.log('updatePassword type:', typeof updatePassword);
console.log('deletePassword type:', typeof deletePassword);
console.log('getPassword type:', typeof getPassword);

// All routes require authentication
router.use(auth);

// Routes
router.get('/', getPasswords);
router.post('/', createPassword);
router.get('/:id', getPassword);
router.put('/:id', updatePassword);
router.delete('/:id', deletePassword);

module.exports = router;