import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';

export class AuthService {
  static async register(userData: {
    firstName: string;
    lastName: string;
    birthDate: Date;
    email: string;
    password: string;
  }) {
    // Проверка на существующего пользователя
    const existingUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    // Создание пользователя
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
      select: { // Исключаем пароль из ответа
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        birthDate: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    // Генерация JWT токена
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    return { user, token };
  }

  static async login(email: string, password: string) {
    // Найти пользователя
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Проверить статус
    if (user.status === 'BLOCKED') {
      throw new Error('User is blocked');
    }

    // Проверить пароль
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Сгенерировать токен
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    // Вернуть данные пользователя (без пароля) и токен
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }
}