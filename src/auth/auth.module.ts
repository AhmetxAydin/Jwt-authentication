import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {PassportModule} from "@nestjs/passport";
import {UsersModule} from "../users/users.module";
import {JwtModule} from "@nestjs/jwt";
import {SequelizeModule} from "@nestjs/sequelize";
import {User} from "../users/Entity/users.entity";
import {LocalStrategy} from "./Strategies/local.strategy";
import {UsersService} from "../users/users.service";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {JwtStrategy} from "./Strategies/jwt.strategy";
import {JwtRefreshTokenStrategy} from "./Strategies/jwt-refreshtoken.strategy";
import {JwtAccessTokenStrategy} from "./Strategies/jwt-accesstoken.startegy";


@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    PassportModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService : ConfigService) =>({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),

    })],
  controllers: [AuthController ],
  providers: [AuthService, LocalStrategy , UsersService, JwtStrategy, JwtRefreshTokenStrategy, JwtAccessTokenStrategy],
  exports: [AuthService , LocalStrategy , JwtModule],
})
export class AuthModule {}