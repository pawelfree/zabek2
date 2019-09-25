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
import { UpdateUserInternalDto } from './dto';
import { Role } from '../shared/role';
import { LabService } from '../lab/lab.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly labService: LabService
  ) {
    console.log('UserController - przemyslec co kto moze zrobic - usunac/edytowac/dodawac');
  }

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
    const user =  await this.userService.findById(req.user._id);
    if (!user) {
      throw new BadRequestException('Użytkownik nie istnieje');
    }
    return user;
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.sadmin, Role.admin)
  @Get()
  async allUsers(
    @Query('pagesize') pagesize: number = 0,
    @Query('page') page: number = 10,
    @Request() req
  ) {
    //TODO dodac sadminowi lab
    console.warn('Dodac sadminowi lab');
    return await this.userService.findAllUsers(+pagesize, +page, req.user.lab);
  }
  
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.sadmin, Role.admin)
  @Post()
  async addUser(@Body() createUserDto: CreateUserDto) {
    const user: User = await this.userService.findByEmail(createUserDto.email);
    if (user) {
      throw new BadRequestException('Użytkownik już istnieje');
    }
    await this.labService.incrementUsers(createUserDto.lab._id);
    const salt = await bcrypt.genSalt(UserController.SALT);
    const _createUserDto = {
      email: createUserDto.email,
      role: createUserDto.role,
      lab: createUserDto.lab._id,
      active: true,
      password: await bcrypt.hash(createUserDto.password, salt)
    } 
    return _.pick(await this.userService.addUser(_createUserDto), [
      'email',
      'role',
      'lab'
    ]);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.sadmin, Role.admin)
  @Delete(':id')
  async deleteUser(@Param('id') id: string, @Request() req) {
    //TODO kto moze usunac kogo
    console.warn('kto moze usunac kogo')
    const user: User =  await this.userService.findById(id);
    if (user.role === Role.sadmin || user.role === Role.doctor) {
      throw new BadRequestException('Nie można usunąć użytkownika');
    }
    if (user.role === Role.admin && req.user.role === Role.admin) {
      throw new BadRequestException('Użytkownik nie może usunąć administratora');
    }
    await this.labService.decrementUsers(user.lab);
    return this.userService.delete(id);
  }


  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.sadmin, Role.admin)
  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.sadmin, Role.admin)
  @Put(':id')
  async updateUser(@Body() updateUserDto: UpdateUserDto, @Param('id') id: string) {
    if (id !== updateUserDto._id ) {
      throw new BadRequestException('Błędne dane użytkownika i żądania');        
    }  
    let error;
    await this.userService.findById(id)
      .then(async user => {
        if (!user) {
          error = new BadRequestException('Użytkownik nie istnieje');
        }  else {
          const salt = await bcrypt.genSalt(UserController.SALT);
          const _updateUserInternalDto: UpdateUserInternalDto = {
            _id: id,
            password: await bcrypt.hash(updateUserDto.password, salt),
            email: updateUserDto.email,
            role: updateUserDto.role,
            lab: updateUserDto.lab._id
          };
          const {n, nModified, ok} = await this.userService.update(_updateUserInternalDto);
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

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.sadmin, Role.admin, Role.user, Role.doctor)
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
          const {n, nModified, ok} = await this.userService.update({
            _id: user._id,
            password: await bcrypt.hash(changePasswordDto.newPassword, salt)
          });
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
