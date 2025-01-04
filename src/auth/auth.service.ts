import { Injectable, UnauthorizedException } from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {UsersService} from "../users/users.service";
import * as bcrypt from 'bcrypt';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly usersService: UsersService,
        private configService : ConfigService) {}

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findUserByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        return user;
    }

    async generateTokens(user: { userId: number; email: string; name: string; surname: string }) {

        const payload = {
            userId: user.userId,
            name: user.name,
            surname: user.surname,
            email: user.email,
        };

        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
            expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN'),
        });

        const refreshToken = this.jwtService.sign(payload , {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
        });

        await  this.saveRefreshToken(user.userId, refreshToken);
        return { accessToken, refreshToken };
    }

    async saveRefreshToken(userId: number, refreshToken: string) {
        const user = await this.usersService.findOneById(userId);

        if (!user) {
            throw new Error('User not found');
        }
        await this.usersService.update(userId, { refresh_token: refreshToken });
    }

}
