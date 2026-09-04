import express from 'express';
import {
  getProducts,
  getProductBySlug,
  getFieldSuggestions,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { protectAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/meta/suggestions', getFieldSuggestions);
router.get('/:slug', getProductBySlug);

// Admin protected routes
router.post('/admin', protectAdmin, createProduct);
router.put('/admin/:id', protectAdmin, updateProduct);
router.delete('/admin/:id', protectAdmin, deleteProduct);

export default router;