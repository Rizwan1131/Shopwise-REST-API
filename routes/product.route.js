import {Router } from 'express'
import { createProduct, deleteProduct, getAllProducts, getProductById, searchProducts, updateProductByAdmin } from '../controllers/product.controller.js'
import { authMiddleware, authorizeRoles } from '../middlewares/auth.middleware.js'


const productRoute = Router()

productRoute.post('/create',authMiddleware,authorizeRoles("admin") ,createProduct)
productRoute.get('/',getAllProducts)
productRoute.get('/get/:id',getProductById);
productRoute.get('/search',searchProducts);
productRoute.post('/update/:id',authMiddleware,authorizeRoles("admin") ,updateProductByAdmin);
productRoute.delete('/delete/:id',authMiddleware,authorizeRoles("admin") ,deleteProduct);

export default productRoute