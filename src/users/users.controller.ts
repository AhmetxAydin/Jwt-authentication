import {Controller  , Get , Req, Post, Body, Delete , Param , Patch,UseGuards} from '@nestjs/common';
import {UsersService} from "./users.service";
import {User} from "./Entity/users.entity";
import {CreateUserDto} from "./Dtos/create-User.dto";
import {UpdateUserDto} from "./Dtos/update-User.dto";
import {JwtAuthGuard} from "../auth/Guards/auth.guard";

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    @Get()
    async getAll(@Req() req): Promise<User[]> {
        console.log(req.user);
        return this.usersService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    Profile(@Req() request: any) {
        const user = request.user;
        return {
            message: 'User profile fetched successfully',
            user,
        };
    }

    @Post("/signUp")
    async create(@Body() createUserDto: CreateUserDto): Promise<User> {
        return  this.usersService.create(createUserDto) ;

    }

    @UseGuards(JwtAuthGuard)
    @Patch('UpdateUser')
    async updateUser(
        @Body() updateUserDto: UpdateUserDto,
        @Req() request: any,
    ):Promise<{message:string; updatedUser:User;}> {
        await this.usersService.update(request.user.id, updateUserDto);
        const updatedUser = await this.usersService.findOneById(request.user.id);
        return {
            message: 'User Informations Updated Successfully',
            updatedUser,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Delete('DeleteUser')
    remove(
        @Req() request: any,
    ) {
        return this.usersService.remove(request.user.id);
    }
}
