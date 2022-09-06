import { Router } from 'express'
import authenticateToken from '@/middlewares/authenticateToken'

const usersRouter = Router()

usersRouter.get('/users/:id', authenticateToken)

export default usersRouter
