
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/users/dto/login.user.dto';
import { UsersService } from 'src/users/services/users.service';
import * as bcrypt from 'bcrypt';

export type authPayload = {
    sub: number, mobile: string, role: string
}

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async signIn(loginUserDto: LoginUserDto): Promise<{ access_token: string }> {
        const { mobile, password } = loginUserDto
        const user = await this.usersService.findByMobile(mobile, { role: true });
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            throw new UnauthorizedException("شماره موبایل یا رمز عبور اشتباه است!");
        }

        const payload: authPayload = { sub: user.id, mobile: user.mobile, role: user.role.role };

        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}

