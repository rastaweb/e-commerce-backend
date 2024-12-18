
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { authPayload } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService,private readonly configService:ConfigService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException("توکن ارسال نشده!");
        }
        try {
            const payload: authPayload = await this.jwtService.verifyAsync(
                token, { secret: this.configService.get<string>('AUTH_SECRET') }
            );

            if (payload.role === "admin") {
                throw "شما دسترسی ندارید!";
            }

            // 💡 We're assigning the payload to the request object here
            // so that we can access it in our route handlers
            request['user'] = payload;
        } catch (e) {
            if (e.name === "JsonWebTokenError") {
                throw new UnauthorizedException("توکن اشتباه است!")
            }
            throw new UnauthorizedException(e)
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
