import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Put,
  UseGuards,
  Param,
  InternalServerErrorException,
  Get,
  Query,
  Request,
  ParseIntPipe} from '@nestjs/common';
import * as _ from 'lodash';
import { UserService } from './user.service';
import { User, Role, Doctor } from '@zabek/data';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../shared/security/roles.decorator';
import { RolesGuard } from '../shared/security/roles.guard';
import { EmailService } from '../shared/email/email.service';
import { DoctorService } from './doctor.service';

@Controller('doctor')
export class DoctorController {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly doctorService: DoctorService
  ) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.sadmin, Role.admin, Role.user)
  @Get()
  async allUsers(
    @Query('pagesize', new ParseIntPipe()) pagesize: number = 0,
    @Query('page', new ParseIntPipe()) page: number = 10,
    @Request() req
  ) {
    return await this.userService.findAllDoctors(
      pagesize,
      page,
      req.user.lab
    );
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.sadmin, Role.admin, Role.user)
  @Get('online')
  async allOnlineDoctors(
    @Query('pagesize', new ParseIntPipe()) pagesize: number = 0,
    @Query('page', new ParseIntPipe()) page: number = 10,
    @Request() req
  ) {
    return await this.doctorService.findAllOnlineDoctors(
      pagesize,
      page,
      req.user.lab
    );
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.sadmin, Role.admin, Role.user)
  @Get(':id')
  async getDoctor(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Post()
  async addDoctor(@Body() doctor: Doctor) {
    console.warn('wymusic polityke haseł i weryfikowac unikalnosc')
    return _.pick(await this.userService.addDoctor(doctor), [
      '_id',
      'firstName',
      'lastName',
      'qualificationsNo'
    ]);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin','user')
  @Put(':id')
  async updateDoctor(@Body() doctor: Doctor, @Param('id') id: string, @Request() req) {
    if (id !== doctor._id ) {
      throw new BadRequestException('Błędne dane lekarza i żądania');        
    }
    const doctorExists: User = await this.userService.findById(id);

    if (!doctorExists) {
      throw new BadRequestException('Lekarz nie istnieje');
    } 
    return await this.doctorService.update(doctor);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.sadmin, Role.admin, Role.user)
  @Put('/activate/:id')
  async activateUser(@Param('id') id: string) {
    let error;
    await this.userService
      .findById(id)
      .then(async (user: User) => {
        if (!user) {
          error = new BadRequestException('Lekarz nie istnieje.');
        } else {
          const newUser: User = Object.assign(new User(), { ...user,
            active: true
          });
          console.log('activate - user', user);
          const { n, nModified, ok } = await this.userService.update(newUser);
          if (n !== 1 || nModified !== 1 || ok !== 1) {
            error = new InternalServerErrorException('Nieznany błąd.');
          }
          this.emailService.sendUserActivatedEmail(user.email);
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
  @Roles(Role.doctor)
  @Put('/acceptrules/:id')
  async acceptRules(@Param('id') id: string) {
    let error;
    await this.userService
      .findById(id)
      .then(async (user: User) => {
        if (!user) {
          error = new BadRequestException('Lekarz nie istnieje.');
        } else {
          const newUser: User = Object.assign(new User(), { ...user,
            rulesAccepted: true
          });
          console.log('accept rules - user', user);
          const { n, nModified, ok } = await this.userService.update(newUser);
          if (n !== 1 || nModified !== 1 || ok !== 1) {
            error = new InternalServerErrorException('Nieznany błąd.');
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
