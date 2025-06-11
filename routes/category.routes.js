import {Router } from 'express'
import { createCategory, deleteCategory, getAllCategories, getSingleCategory, updateCategory } from '../controllers/category.controller.js'
import { authMiddleware, authorizeRoles } from '../middlewares/auth.middleware.js';


const cetegoryRoute = Router()

cetegoryRoute.post('/create',authMiddleware, authorizeRoles('admin'), createCategory)
cetegoryRoute.put("/:id", authMiddleware,authorizeRoles('admin'), updateCategory);
cetegoryRoute.delete("/:id",authMiddleware,authorizeRoles('admin'), deleteCategory);
cetegoryRoute.get("/",authMiddleware, getAllCategories);
cetegoryRoute.get("/:id",authMiddleware, getSingleCategory)

export default cetegoryRoute