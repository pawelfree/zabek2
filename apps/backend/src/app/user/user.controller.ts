import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { UserPasswordDto } from './userpassword.dto';
import { Role } from './role';
// import { throwError } from 'rxjs';

@Controller('users')
export class UserController {
    private users: {id: number, username: string, password: string, role: Role }[] = [
        { id: 1, username: 'admin', password: 'admin', role: Role.admin },
        { id: 2, username: 'user', password: 'user', role: Role.user },
        { id: 3, username: 'doctor', password: 'doctor', role: Role.doctor }
    ];

    @Post('authenticate')
    getData(@Body() userPasswordDto: UserPasswordDto)  {
        const user = this.users.find(x => x.username === userPasswordDto.username && x.password === userPasswordDto.password);
        if (!user) {
            throw  new HttpException('Username or password is incorrect', HttpStatus.BAD_REQUEST);
        }
        return {
            id: user.id,
            username: user.username,
            firstName: "firstname",
            lastName: "lastname",
            role: user.role,
            token: `fake-jwt-token.${user.role}`
        };
    }
}
