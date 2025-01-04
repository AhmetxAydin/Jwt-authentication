import { Injectable , UnauthorizedException} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt,  Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refreshtoken') {
    constructor(
        private readonly usersService: UsersService,
        private configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromBodyField('refreshToken'),
            secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
        });
    }

    async validate(payload: any) {
        if (!payload || !payload.userId) {
            throw new UnauthorizedException('Invalid token');
        }
        const user = await this.usersService.findOneById(payload.userId);

        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return user;
    }
}