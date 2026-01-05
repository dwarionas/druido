import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';

function extractJwtFromCookieOrHeader(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.slice(7).trim();
    }

    // fallback to cookie
    if (req.cookies?.token) {
        return req.cookies.token;
    }

    return null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET environment variable is required');
        }

        super({
            jwtFromRequest: extractJwtFromCookieOrHeader,
            ignoreExpiration: false,
            secretOrKey: secret,
        });
    }

    validate(payload: { sub: string }) {
        return { userId: payload.sub };
    }
}
