import { Router } from 'express'
import { AuthController } from '../controllers/AuthController'
import { UserController } from '../controllers/UserController'
import { authenticateToken, requireAdmin, requireSelfOrAdmin } from '../middleware/auth'
import { validate } from '../middleware/validation'
import { registerSchema, loginSchema, statusSchema } from '../utils/validation'

const router = Router()

// Паблик маршруты
router.post('/auth/register', validate(registerSchema), AuthController.register)
router.post('/auth/login', validate(loginSchema), AuthController.login)

// Это короче приватные маршруты
router.get('/users/:id', authenticateToken, requireSelfOrAdmin, UserController.getUserById)
router.get('/users', authenticateToken, requireAdmin, UserController.getAllUsers)
router.get('/users/me', authenticateToken, UserController.getCurrentUser);
router.patch(
  '/users/:id/status',
  authenticateToken,
  requireSelfOrAdmin,
  validate(statusSchema),
  UserController.toggleUserStatus
)

export default router