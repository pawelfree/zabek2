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
import * as _ from 'lodash';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UserController {
    private static salt = 10;

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
        
        return {
                id: user._id,
                email: user.email,
                role: user.role,
                token: `fake-jwt-token.${user.role}`
            };
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return _.pick((await this.userService.findById(id)),['_id','email', 'role']);
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
        const salt = await bcrypt.genSalt(UserController.salt);
        _createUserDto.password = await bcrypt.hash(createUserDto.password, salt);
        return _.pick((await this.userService.add(_createUserDto)), ['_id','email', 'role']);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string) {
        return await this.userService.delete(id);
    }
}
