import {UnauthorizedException,Req, Controller,UseGuards, Post, Body} from '@nestjs/common';
import {JwtService} from "@nestjs/jwt";
import {ConfigService} from '@nestjs/config';
import {JwtRefreshGuard} from "./Guards/jwtRefresh.guard";
import {AuthService} from "./auth.service";
import {JwtLoginGuard} from "./Guards/jwt-login.guard";
import {RefreshTokenDto} from './Dto/RefreshToken.dto';
import {UsersService} from "../users/users.service";
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
    constructor(private jwtService: JwtService,
                private  configService:ConfigService,
                private authService: AuthService,
                private usersService:UsersService,) {}

    @UseGuards(JwtLoginGuard)
    @Post('login')
    async login(@Body('email') email: string, @Body('password') password: string) {
        const user = await this.authService.validateUser(email, password);
        const payload = {
            userId: user.id,
            name: user.first_name,
            surname: user.last_name,
            email: user.email,
        };
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
            expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN'),
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            expiresIn:  this.configService.get('JWT_REFRESH_EXPIRES_IN'),
        });

        await this.authService.saveRefreshToken(user.id, refreshToken);
        return { accessToken, refreshToken };
    }


    @UseGuards(JwtRefreshGuard)
    @Post('refresh')
    async refresh(@Body() body: RefreshTokenDto) {
        const { refreshToken, password, email } = body;

        const user = await this.usersService.findUserByEmail(email);
        if (!user) {
            throw new UnauthorizedException('Invalid email ');
        }

        const isRefreshTokenValid = refreshToken.localeCompare(user.refresh_token);
        if (isRefreshTokenValid !== 0) {
            throw new UnauthorizedException('Invalid refresh token');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid  password');
        }

        const tokens = await this.authService.generateTokens({
            userId: user.id,
            email: user.email,
            name: user.first_name,
            surname: user.last_name,
        });

        return tokens;
    }
}