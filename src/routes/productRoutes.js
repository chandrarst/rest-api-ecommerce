const express = require('express');
const router = express.Router();
const { getAllProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const authenticateToken = require('../middlewares/authMiddleware');
const authorizeAdmin = require('../middlewares/adminMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/', getAllProducts);
router.post('/', authenticateToken, authorizeAdmin, upload.single('image'), createProduct);
router.put('/:id', authenticateToken, authorizeAdmin, upload.single('image'), updateProduct);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteProduct);

module.exports = router;