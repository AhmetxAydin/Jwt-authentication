import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {User} from "./Entity/users.entity";
import {CreateUserDto} from "./Dtos/create-User.dto";
import {UpdateUserDto} from "./Dtos/update-User.dto";
import {InjectModel } from '@nestjs/sequelize';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User)
        private  userModel : typeof  User,
    ) {}

    async findOneById(id: number): Promise<User> {
        return this.userModel.findOne({where : { id : id }});
    }

    async findAll(): Promise<User[]> {
        return this.userModel.findAll();
    }

    async findUserByEmail(email: string): Promise<User | null> {
        try {
            const user = await this.userModel.findOne({ where: { email : email} });
            if (!user) {
                console.error('User not found');
                return null;
            }
            return user;
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw new Error('Error finding user by email');
        }
    }


    async  checkEmailExists(email: string): Promise<boolean> {
        const user = await this.userModel.findOne({ where: { email } });
        return !!user;
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = new User();

        user.first_name = createUserDto.first_name;
        user.last_name = createUserDto.last_name;
        user.email = createUserDto.email;
        user.password = createUserDto.password;

        const emailExists = await  this.checkEmailExists(user.email);

        if(emailExists){
            throw new HttpException('This email is already exists' , HttpStatus.BAD_REQUEST);

        }
        return  user.save();

    }

    async update(id:number, updateUserDto : UpdateUserDto): Promise<User> {
        const user = await this.findOneById(id);
        user.first_name = updateUserDto.first_name || user.first_name;
        user.last_name = updateUserDto.last_name || user.last_name;
        user.email = updateUserDto.email || user.email;
        user.password = updateUserDto.password || user.password;
        user.refresh_token = updateUserDto.refresh_token || user.refresh_token;
        return  user.save();
    }

    async remove(id: number): Promise<void> {
        const user = await this.findOneById(id);
        await user.destroy();
    }
}
