import {Router } from 'express'
import { addAdress, deleteAddress, updateAddress } from '../controllers/adress.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'

const addressRoute = Router()
addressRoute.post('/add',authMiddleware, addAdress)
addressRoute.post('/update/:id',authMiddleware, updateAddress)
addressRoute.post('/delete/:id',authMiddleware, deleteAddress)
addressRoute.post('/get-all-address',authMiddleware, addAdress)

export default addressRoute