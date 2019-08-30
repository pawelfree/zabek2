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
  Param,
  Put,
  InternalServerErrorException
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateUserDto, UpdateUserDto, ChangePasswordDto } from './dto';
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
  
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'sadmin')
  @Post()
  async addUser(@Body() createUserDto: CreateUserDto) {
    const user: User = await this.userService.findByEmail(createUserDto.email);
    if (user) {
      throw new BadRequestException('Użytkownik już istnieje');
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
  async deleteUser(@Param('id') id: string, @Request() req) {
    const user: User =  await this.userService.findById(id);
    if (user.role === 'sadmin') {
      throw new BadRequestException('Nie można usunąć super administratora');
    }
    if (user.role === 'admin' && req.user.role === 'admin') {
      throw new BadRequestException('Użytkownik nie może usunąć administratora');
    }
    return this.userService.delete(id);
  }


  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'sadmin')
  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'sadmin')
  @Put(':id')
  async updateUser(@Body() updateUserDto: UpdateUserDto, @Param('id') id: string) {
    if (id !== updateUserDto._id ) {
      throw new BadRequestException('Błędne dane użytkownika i żądania');        
    }  
    const user: User = await this.userService.findById(id);
    if (!user) {
      throw new BadRequestException('Użytkownik nie istnieje');
    }  
    return await this.userService.update(updateUserDto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'sadmin', 'user', 'doctor')
  @Post('changepassword')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Request() req){
    if (!changePasswordDto.newPassword || ! changePasswordDto.oldPassword) {
      throw new BadRequestException('Brak danych wejściowych');
    }
    let error = null;
    await this.authService.validateUser(req.user.email, changePasswordDto.oldPassword)
      .then(async ({ user , message}) => {
        if (!user) {
          error = new BadRequestException(message);
        } else {
          const salt = await bcrypt.genSalt(UserController.SALT);
          const updateUserDto: UpdateUserDto = {
            _id: user._id,
            password: await bcrypt.hash(changePasswordDto.newPassword, salt),
            email: user.email,
            role: user.role
          };
          const {n, nModified, ok} = await this.userService.update(updateUserDto);
          if ( n !== 1 || nModified !== 1 || ok !== 1 ) {
            error = new InternalServerErrorException('Nieznany błąd');
          } 
        }
      })
      .catch(err => {
        error = new BadRequestException(err);
      });

      if (error) {
        throw error;
      }
  }
}
