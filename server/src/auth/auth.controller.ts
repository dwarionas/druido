import { Controller, Post, Get, Patch, Body, Res, UseGuards, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { Throttle } from '@nestjs/throttler';

import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import { UpdateProfileDto, ChangePasswordDto } from './dto/profile.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { Public } from '../common/public.decorator';

const COOKIE_NAME = 'token';
const COOKIE_MAX_AGE = 1000 * 60 * 60 * 24 * 30; // ~30d

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Post('register')
    async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
        const { user, token } = await this.authService.register(dto);
        this.setAuthCookie(res, token);

        return {
            id: user.id,
            email: user.email,
            name: user.name,
        };
    }

    @Public()
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const { user, token } = await this.authService.login(dto);
        this.setAuthCookie(res, token);

        return {
            id: user.id,
            email: user.email,
            name: user.name,
        };
    }

    @Public()
    @Post('logout')
    @HttpCode(HttpStatus.NO_CONTENT)
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie(COOKIE_NAME);
        return;
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async me(@CurrentUser() userId: string) {
        const user = await this.authService.getProfile(userId);
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return user;
    }

    @UseGuards(JwtAuthGuard)
    @Patch('profile')
    async updateProfile(@CurrentUser() userId: string, @Body() dto: UpdateProfileDto) {
        return this.authService.updateProfile(userId, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Post('change-password')
    @HttpCode(HttpStatus.OK)
    async changePassword(@CurrentUser() userId: string, @Body() dto: ChangePasswordDto) {
        return this.authService.changePassword(userId, dto);
    }

    private setAuthCookie(res: Response, token: string) {
        res.cookie(COOKIE_NAME, token, {
            httpOnly: true,
            secure: true, // required for cross-site cookies
            sameSite: 'none', // required for cross-site cookies (Vercel -> Render)
            maxAge: COOKIE_MAX_AGE,
        });
    }
}
