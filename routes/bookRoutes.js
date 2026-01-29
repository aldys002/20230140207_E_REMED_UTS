const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const borrowController = require('../controllers/borrowController');
const { checkRole } = require('../middleware/auth');

// --- PUBLIC ---
router.get('/', bookController.getAllBooks); 
router.get('/:id', bookController.getBookById); 

// --- ADMIN MODE (Header x-user-role: admin) 
router.post('/', checkRole('admin'), bookController.addBook); 
router.put('/:id', checkRole('admin'), bookController.updateBook); 
router.delete('/:id', checkRole('admin'), bookController.deleteBook); 
// --- USER MODE (Header x-user-role: user) --- 
router.post('/borrow', checkRole('user'), borrowController.borrowBook); 

module.exports = router;
