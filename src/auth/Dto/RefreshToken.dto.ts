import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class RefreshTokenDto {
    @IsString()
    @IsNotEmpty()
    refreshToken: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsEmail()
    email: string;
}
