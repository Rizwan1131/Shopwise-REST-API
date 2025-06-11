import {Router } from 'express'
import { getAllOrders, getMyOrders, placeOrder, updateOrderStatus } from '../controllers/order.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'


const orderRoute = Router()

orderRoute.post('/place-order',authMiddleware, placeOrder)
orderRoute.get('/myorder',authMiddleware, getMyOrders)
orderRoute.get('/get-all-order',authMiddleware, getAllOrders)
orderRoute.put('/update/:orderId',authMiddleware, updateOrderStatus)

export default orderRoute