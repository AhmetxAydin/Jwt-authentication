import {Module} from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import {UsersModule} from "./users/users.module";
import {User} from "./users/Entity/users.entity";
import { AuthModule } from './auth/auth.module';
import {AuthService} from "./auth/auth.service";
import {AuthController} from "./auth/auth.controller";
import {JwtAccessTokenStrategy} from "./auth/Strategies/jwt-accesstoken.startegy";
import{JwtRefreshTokenStrategy} from "./auth/Strategies/jwt-refreshtoken.strategy";

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true,  envFilePath: '.env',}),
    SequelizeModule.forRoot({
      dialect: 'mssql',
      host: process.env.DB_HOST ,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      models: [User],
      autoLoadModels: true,
      synchronize: true,
      define: {
        timestamps: false,
      },
    }),
      UsersModule,
      AuthModule,
  ],
  controllers: [AuthController],
  providers: [AuthService,  JwtAccessTokenStrategy, JwtRefreshTokenStrategy,],
})
export class AppModule {}
