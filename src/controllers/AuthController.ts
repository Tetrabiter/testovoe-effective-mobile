import { Request, Response } from 'express'
import { AuthService } from '../services/AuthService'

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { firstName, lastName, birthDate, email, password } = req.body

      // Базовая валидация (можно заменить на Zod)
      if (!firstName || !lastName || !birthDate || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' })
      }

      const result = await AuthService.register({
        firstName,
        lastName,
        birthDate: new Date(birthDate),
        email,
        password
      })

      res.status(201).json(result)
    } catch (error: any) {
      if (error.message === 'User with this email already exists') {
        return res.status(409).json({ message: error.message })
      }
      res.status(500).json({ message: 'Internal server error', error: error.message })
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' })
      }

      const result = await AuthService.login(email, password)
      res.json(result)
    } catch (error: any) {
      if (error.message === 'Invalid credentials' || error.message === 'User is blocked') {
        return res.status(401).json({ message: error.message })
      }
      res.status(500).json({ message: 'Internal server error', error: error.message })
    }
  }
}