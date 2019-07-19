import { Controller, Post, Body, BadRequestException, HttpException } from '@nestjs/common';
import { UserPasswordDto } from './userpassword.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Post('authenticate')
    async authenticate(@Body() userPasswordDto: UserPasswordDto)  {
    
        const user = await this.userService.authenticate(userPasswordDto);

        if (user) {
            return {
                    id: user._id,
                    username: user.username,
                    role: user.role,
                    token: `fake-jwt-token.${user.role}`
                };
        }
        else {
            throw new BadRequestException('Invalid username or password');
        }
    }
}
