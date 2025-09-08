import { z } from 'zod'

export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  birthDate: z.string().datetime({ offset: true }).or(z.date()),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
})

export const statusSchema = z.object({
  status: z.enum(['ACTIVE', 'BLOCKED'])
})