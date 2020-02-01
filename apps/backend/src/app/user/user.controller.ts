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
import { User, Role } from '@zabek/data';
import * as _ from 'lodash';
import { LabService } from '../lab/lab.service';
import { AuthService } from '../shared/security/auth.service';
import * as crypto from 'crypto';
import { DoctorService } from './doctor.service';

@Controller('user')
export class UserController {

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly labService: LabService,
    private readonly doctorService: DoctorService
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
  
  //TODO hash password on presave isModified or null
//   userModel.pre('save', async function save(next) {
//     if (!this.isModified('password')) return next();
//     try {
//       const salt = await bcrypt.genSalt(saltRounds);
//       this.password = await bcrypt.hash(this.password, salt);
//       return next();
//     } catch (err) {
//       return next(err);
//     }
// });

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.sadmin, Role.admin, Role.user)
  @Post()
  async addUser(@Body() userToCreate: User) {
    console.warn('wymusic polityke haseł')
    const user: User = await this.userService.findByEmail(userToCreate.email);
    if (user) {
      throw new BadRequestException('Użytkownik już istnieje');
    }
    //TODO to musi sie zadziac razem
    await this.labService.incrementUsers(userToCreate.lab._id);
    const doctor = userToCreate.doctor ? await this.doctorService.addDoctor(userToCreate.doctor) : null;
    const newUser: User = Object.assign(new User(), {
      _id: null,
      doctor: doctor, 
      email: userToCreate.email,
      role: userToCreate.role,
      lab: userToCreate.lab,
      active: userToCreate.active,
      rulesAccepted: userToCreate.rulesAccepted,
      password: userToCreate.password ? await this.authService.hash(userToCreate.password) : await this.authService.hash(crypto.randomBytes(20).toString('hex'))
    });
    return _.pick(await this.userService.addUser(newUser), [
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
    await this.labService.decrementUsers(user.lab._id);
    return this.userService.delete(id);
  }


  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.sadmin, Role.admin, Role.user)
  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.sadmin, Role.admin, Role.user)
  @Put(':id')
  async updateUser(@Body() userToUpdate: User, @Param('id') id: string) {
    console.warn('wymusic polityke haseł')
    if (id !== userToUpdate._id ) {
      throw new BadRequestException('Błędne dane użytkownika i żądania');        
    }  
    let error;
    await this.userService.findById(id)
      .then(async user => {
        if (!user) {
          error = new BadRequestException('Użytkownik nie istnieje');
        }  else {

          if (userToUpdate.password) {
            const updatedUser: User = Object.assign(new User(), { ...user,
            password: await this.authService.hash(userToUpdate.password)});
            console.log('tylko zmiana hasla uzytkownika online')
            const {n, nModified, ok} = await this.userService.update(updatedUser);
            console.log(n,nModified, ok)
            if ( n !== 1 || nModified !== 1 || ok !== 1 ) {
              error = new InternalServerErrorException('Nieznany błąd - zapis uzytkownika');
            } 
          } else {
            console.log('zmiana danych lekarza', userToUpdate.doctor);
            const {n, nModified, ok} = await this.doctorService.update(userToUpdate.doctor);
            if ( n !== 1 || nModified !== 1 || ok !== 1 ) {
              error = new InternalServerErrorException('Nieznany błąd - zapis lekarza');
            } 
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
