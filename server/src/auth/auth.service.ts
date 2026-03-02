import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { UpdateProfileDto, ChangePasswordDto } from './dto/profile.dto';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        const existing = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase().trim() },
        });

        if (existing) {
            // generic message to prevent user enumeration
            throw new ConflictException('Registration failed');
        }

        const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

        const user = await this.prisma.user.create({
            data: {
                email: dto.email.toLowerCase().trim(),
                passwordHash,
                name: dto.name,
            },
        });

        // console.log('registered:', user.email);
        const token = this.signToken(user.id);
        return { user, token };
    }

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email.toLowerCase().trim() },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isValid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const token = this.signToken(user.id);
        return { user, token };
    }

    async getProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                xp: true,
                streak: true,
                dailyGoal: true,
                lastStudiedAt: true,
                createdAt: true,
            },
        });
        return user;
    }

    async updateProfile(userId: string, dto: UpdateProfileDto) {
        return this.prisma.user.update({
            where: { id: userId },
            data: {
                ...(dto.name !== undefined && { name: dto.name }),
                ...(dto.dailyGoal !== undefined && { dailyGoal: dto.dailyGoal }),
            },
            select: {
                id: true,
                email: true,
                name: true,
                xp: true,
                streak: true,
                dailyGoal: true,
                lastStudiedAt: true,
            },
        });
    }

    async changePassword(userId: string, dto: ChangePasswordDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        const isValid = await bcrypt.compare(dto.currentPassword, user.passwordHash);
        if (!isValid) {
            throw new UnauthorizedException('Current password is incorrect');
        }

        const passwordHash = await bcrypt.hash(dto.newPassword, BCRYPT_ROUNDS);
        await this.prisma.user.update({
            where: { id: userId },
            data: { passwordHash },
        });

        return { success: true };
    }

    private signToken(userId: string): string {
        return this.jwt.sign({ sub: userId });
    }
}
