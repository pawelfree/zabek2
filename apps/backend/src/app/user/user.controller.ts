import { Controller,  
    Post, 
    Request,
    UseGuards, 
    Get} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
 
@Controller('user')
export class UserController {
    private static SALT = 10;

    constructor(private readonly authService: AuthService,
        private readonly userService: UserService) {}

    @UseGuards(AuthGuard('local'))
    @Post('authenticate')
    async authenticate(@Request() req) {
        const token = await this.authService.login(req.user);
        return {
                id: req.user._id,
                email: req.user.email,
                role: req.user.role,
                token
            };
    }


    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    async findOne(@Request() req) {
        return await this.userService.findById(req.user._id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async allUsers(){
        return await this.userService.findAll();
    }

    // @Post()
    // async addUser(@Body() createUserDto: CreateUserDto) {
    //     const user: User = await  this.userService.findByEmail(createUserDto.email);
    //     if  (user) {
    //         throw new BadRequestException('User already registered');
    //     }
    //     const _createUserDto = _.pick(createUserDto,['email', 'role']);
    //     const salt = await bcrypt.genSalt(UserController.SALT);
    //     _createUserDto.password = await bcrypt.hash(createUserDto.password, salt);
    //     return await this.userService.add(_createUserDto);
    // }

}
