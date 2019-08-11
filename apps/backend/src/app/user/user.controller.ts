import {
  Controller,
  Post,
  Request,
  UseGuards,
  Get,
  Body,
  BadRequestException,
  Query,
  Delete,
  Param
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateUserDto } from './dto/createuser.dto';
import { User } from './user.interface';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';

@Controller('user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  static SALT = 10;

  @UseGuards(AuthGuard('local'))
  @Post('authenticate')
  async authenticate(@Request() req) {
    const userData = await this.authService.login(req.user);
    return userData;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async findOne(@Request() req) {
    return await this.userService.findById(req.user._id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'sadmin')
  @Get()
  async allUsers(
    @Query('pagesize') pagesize: number,
    @Query('page') page: number
  ) {
    return await this.userService.findAll(+pagesize, +page);
  }

  @Post()
  async addUser(@Body() createUserDto: CreateUserDto) {
    const user: User = await this.userService.findByEmail(createUserDto.email);
    if (user) {
      throw new BadRequestException('User already registered');
    }
    const _createUserDto = _.pick(createUserDto, ['email', 'role']);
    const salt = await bcrypt.genSalt(UserController.SALT);
    _createUserDto.password = await bcrypt.hash(createUserDto.password, salt);
    return _.pick(await this.userService.add(_createUserDto), [
      'email',
      'role'
    ]);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'sadmin')
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    //TODO
    console.log('delete user' + id);
  }
}
