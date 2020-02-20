import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Put,
  UseGuards,
  Param,
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
    @Query('term') term: string = '',
    @Query('sort') sort: string = ''
  ) {
    return await this.doctorService.findAllDoctors(
      pagesize,
      page,
      term,
      sort
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
  //TODO przerobic param na pipe
  async getDoctor(@Param('id') id: string) {
    const checkForDoctorId = new RegExp("^[0-9a-fA-F]{24}$")
    if (!checkForDoctorId.test(id)) {
      throw new BadRequestException('Niepoprawny identyfikator lekarza.')
    }
    return this.doctorService.findById(id);
  }

  @Post()
  async addDoctor(@Body() doctor: Doctor) {
    console.warn('wymusic polityke haseł i weryfikowac unikalnosc')
    return _.pick(await this.doctorService.addDoctor(doctor), [
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
          this.userService.activate(user).then(
            res => {
              this.emailService.sendUserActivatedEmail(user.email);
              return res;
            }
          )
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
          return await this.userService.acceptRules(user);
        }
      })
      .catch(err => {
        error = new BadRequestException(err);
      });
    if (error) {
      throw error;
    }
  }

  @Get('pwztaken/:pwz')
  async isPwzTaken(@Param('pwz') qualificationsNo: string, @Query('doctor') doctor_id: string = null) {
    return await this.doctorService.findByPwz(qualificationsNo, doctor_id) ? true : false;
  }

  @Get('peseltaken/:pesel')
  async isPeselTaken(@Param('pesel') pesel: string, @Query('doctor') doctor_id: string = null) {
    return await this.doctorService.findByPesel(pesel, doctor_id) ? true : false;
  }

  @Get('niptaken/:nip')
  async isNipTaken(@Param('nip') nip: string, @Query('doctor') doctor_id: string = null) {
    return await this.doctorService.findByNip(nip, doctor_id) ? true : false;
  }
}
