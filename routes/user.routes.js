import {Router } from 'express'
import { createUser, login, verifyEmail } from '../controllers/user.controller.js'

const userRoute = Router()

userRoute.post('/register', createUser)
userRoute.get('/verify/:token', verifyEmail)
userRoute.post('/login', login)

export default userRoute