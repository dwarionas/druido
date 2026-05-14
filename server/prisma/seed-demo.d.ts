import { PrismaClient } from '@prisma/client';
export declare function seedDemoUser(prisma: PrismaClient): Promise<{
    email: string;
    name: string | null;
    dailyGoal: number;
    id: string;
    passwordHash: string;
    xp: number;
    streak: number;
    lastStudiedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}>;
export declare function resetDemoUser(prisma: PrismaClient): Promise<{
    email: string;
    name: string | null;
    dailyGoal: number;
    id: string;
    passwordHash: string;
    xp: number;
    streak: number;
    lastStudiedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}>;
