import { Controller, 
    BadRequestException, 
    Body, 
    Post, 
    Get, 
    Delete, 
    Param} from '@nestjs/common';
import { UserPasswordDto } from './dto/userpassword.dto';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createuser.dto';
import { User } from './user.interface';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UserController {
    private static SALT = 10;

    constructor(private readonly userService: UserService) {}

    @Post('authenticate')
    async authenticate(@Body() userPasswordDto: UserPasswordDto)  {

        const user: User = await  this.userService.findByEmail(userPasswordDto.email);
        if  (!user) {
            throw new BadRequestException('Invalid email or password');
        }
    
        const validPassword = await bcrypt.compare(userPasswordDto.password, user.password);

        if(!validPassword) {
            throw new BadRequestException('Invalid email or password');
        }
        
        const token = await user.generateAuthToken();

        return {
                id: user._id,
                email: user.email,
                role: user.role,
                token
            };
    }

    @Get('me')
    async findOne() {
        const id = "q"
        return await this.userService.findById(id);
    }

    @Get()
    async allUsers(){
        return await this.userService.findAll();
    }

    @Post()
    async addUser(@Body() createUserDto: CreateUserDto) {
        const user: User = await  this.userService.findByEmail(createUserDto.email);
        if  (user) {
            throw new BadRequestException('User already registered');
        }
        const _createUserDto = _.pick(createUserDto,['email', 'role']);
        const salt = await bcrypt.genSalt(UserController.SALT);
        _createUserDto.password = await bcrypt.hash(createUserDto.password, salt);
        return await this.userService.add(_createUserDto);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        return await this.userService.delete(id);
    }
}
