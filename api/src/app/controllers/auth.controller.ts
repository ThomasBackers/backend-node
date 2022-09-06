import { Request, Response } from 'express'
import { Op } from 'sequelize'
import bcrypt from 'bcrypt'
import jwt, { VerifyErrors, JwtPayload } from 'jsonwebtoken'
import User from '@/models/user.model'

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = await User.create({ username, email, passwordHash })
    if (!user) return res.status(403).json({ message: 'invalid request' })
    return res.status(201).json({ message: 'account successfully created' })
  } catch (error: unknown) {
    return res.status(500).json({ message: 'something went wrong' })
  }
}

export const login = async (req: Request, res: Response): Promise<
  Response<
    any,
    Record<string, any>
  >
> => {
  try {
    const { username, email, password } = req.body
    const user = await User.findOne({
      attributes: {
        exclude: ['avatarPath']
      },
      where: {
        [Op.or]: [{ username }, { email }]
      }
    })
    if (!user) return res.status(401).json({ message: 'invalid credentials' })
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
    if (isPasswordValid) {
      const { id, username, email } = user
      const payload = { id, username, email }
      const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
      const accessToken = jwt.sign(payload, accessTokenSecret, { expiresIn: '1800s' })
      const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET
      const refreshToken = jwt.sign(payload, refreshTokenSecret, { expiresIn: '1y' })
      return res.status(200).json({ accessToken, refreshToken })
    } else return res.status(401).json({ message: 'invalid credentials' })
  } catch (error: unknown) {
    return res.status(500).json({ message: 'something went wrong' })
  }
}

export const refreshToken = async (req: Request, res: Response): Promise<
  Response<
    any,
    Record<string, any>
  >
> => {
  try {
    const authHeader = req.headers.Authorization
    if (typeof authHeader !== 'string') return res.status(401).json({ message: 'invalid token' })
    const refreshToken = authHeader.split(' ')[1] // 'Bearer <token>'
    if (!refreshToken) return res.status(401).json({ message: 'invalid token' })
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET
    jwt.verify(refreshToken, refreshTokenSecret, (error: VerifyErrors, payload: JwtPayload) => {
      if (error) return res.status(401).json({ message: 'invalid token' })
      // check into DB if the user is allowed to do that (not banned etc)
      // and still exists or send back an error
      delete payload.iat
      delete payload.exp
      const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
      const accessToken = jwt.sign(payload, accessTokenSecret, { expiresIn: '1800s' })
      return res.status(200).json({ accessToken })
    })
  } catch (error: unknown) {
    return res.status(500).json({ message: 'something went wrong' })
  }
}
