import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { AuthRequest } from '../middleware/auth';

export class UserController {
    static async getUserById(req: AuthRequest, res: Response) {
        try {
            const userId = parseInt(req.params.id);
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
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

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(user);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error', error });
        }
    }

    static async getCurrentUser(req: AuthRequest, res: Response) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: req.user!.userId },
                select: {
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

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(user);
        } catch (error: any) {
            res.status(500).json({ message: 'Internal server error', error: error.message });
        }
    }

    static async getAllUsers(req: AuthRequest, res: Response) {
        try {
            // Пагинация, фильтрация могут быть добавлены здесь
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    birthDate: true,
                    role: true,
                    status: true,
                    createdAt: true,
                },
                orderBy: { createdAt: 'desc' },
            });
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: 'Internal server error', error });
        }
    }

    static async toggleUserStatus(req: AuthRequest, res: Response) {
        try {
            const userId = parseInt(req.params.id);
            const { status } = req.body; // 'ACTIVE' или 'BLOCKED'

            if (!['ACTIVE', 'BLOCKED'].includes(status)) {
                return res.status(400).json({ message: 'Status must be ACTIVE or BLOCKED' });
            }

            const user = await prisma.user.update({
                where: { id: userId },
                data: { status },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    status: true,
                },
            });

            res.json({ message: `User status updated to ${status}`, user });
        } catch (error) {
            res.status(500).json({ message: 'Internal server error', error });
        }
    }
}