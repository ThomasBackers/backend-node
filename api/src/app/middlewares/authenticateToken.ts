import { Request, Response, NextFunction } from 'express'
import jwt, { VerifyErrors, JwtPayload } from 'jsonwebtoken'

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.Authorization
    if (typeof authHeader !== 'string') return res.status(401).json({ message: 'invalid token' })
    const accessToken = authHeader.split(' ')[1] // 'Bearer <token>'
    if (!accessToken) return res.status(401).json({ message: 'invalid token' })
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
    jwt.verify(accessToken, accessTokenSecret, (error: VerifyErrors, payload: JwtPayload) => {
      if (error) return res.status(401).json({ message: 'invalid token' })
      req.body.payload = payload
      next()
    })
  } catch (error: unknown) {
    return res.status(500).json({ message: 'something went wrong' })
  }
}

export default authenticateToken
