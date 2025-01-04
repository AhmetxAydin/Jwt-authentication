import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    first_name: string;
    @IsNotEmpty()
    last_name: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

}