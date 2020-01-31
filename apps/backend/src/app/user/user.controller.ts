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
  InternalServerErrorException,
  ParseIntPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from './user.service';
import { Roles } from '../shared/security/roles.decorator';
import { RolesGuard } from '../shared/security/roles.guard';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User, Role } from '@zabek/data';
import * as _ from 'lodash';
import { UpdateUserInternalDto } from './dto';
import { LabService } from '../lab/lab.service';
import { AuthService } from '../shared/security/auth.service';

@Controller('user')
export class UserController {

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly labService: LabService
  ) {
    console.log('UserController - przemyslec co kto moze zrobic - usunac/edytowac/dodawac');
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
    @Query('pagesize', new ParseIntPipe()) pagesize: number = 0,
    @Query('page', new ParseIntPipe()) page: number = 10,
    @Request() req
  ) {
    //TODO dodac sadminowi lab
    console.warn('Dodac sadminowi lab');
    return await this.userService.findAllUsers(pagesize, page, req.user.lab);
  }
  
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.sadmin, Role.admin)
  @Post()
  async addUser(@Body() createUserDto: CreateUserDto) {
    console.warn('wymusic polityke haseł')
    const user: User = await this.userService.findByEmail(createUserDto.email);
    if (user) {
      throw new BadRequestException('Użytkownik już istnieje');
    }
    await this.labService.incrementUsers(createUserDto.lab._id);
    const _createUserDto = {
      email: createUserDto.email,
      role: createUserDto.role,
      lab: createUserDto.lab._id,
      active: true,
      password: await this.authService.hash(createUserDto.password)
    } 
    return _.pick(await this.userService.addUser(_createUserDto), [
      '_id',
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
    console.warn('wymusic polityke haseł')
    if (id !== updateUserDto._id ) {
      throw new BadRequestException('Błędne dane użytkownika i żądania');        
    }  
    let error;
    await this.userService.findById(id)
      .then(async user => {
        if (!user) {
          error = new BadRequestException('Użytkownik nie istnieje');
        }  else {
          const _updateUserInternalDto: UpdateUserInternalDto = {
            _id: id,
            password: await this.authService.hash(updateUserDto.password),
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
}
