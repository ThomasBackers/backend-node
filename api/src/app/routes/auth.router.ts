import { Router } from 'express'
import { login, refreshToken } from '@/controllers/auth.controller'

const authRouter = Router()

authRouter.post('/login', login)
authRouter.post('/refreshToken', refreshToken)

export default authRouter
