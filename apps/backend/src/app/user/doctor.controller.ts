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
import { User } from './user.interface';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../shared/security/roles.decorator';
import { RolesGuard } from '../shared/security/roles.guard';
import { UpdateUserInternalDto, CreateDoctorDto, UpdateDoctorDto } from './dto';
import { Role } from '../shared/role';
import { LabService } from '../lab/lab.service';
import { Lab } from '../lab/lab.interface';
import { AuthService } from '../shared/security/auth.service';
import { EmailService } from '../shared/email/email.service';
import * as crypto from 'crypto';

@Controller('doctor')
export class DoctorController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly labService: LabService,
    private readonly emailService: EmailService
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
  @Get(':id')
  async getDoctor(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Post()
  async addDoctor(@Body() createDoctorDto: CreateDoctorDto) {
    console.warn('wymusic polityke haseł')
    const user: User = await this.userService.findByEmail(createDoctorDto.email);
    if (user) {
      throw new BadRequestException('Lekarz jest już zarejestrowany');
    }
    const lab: Lab = await this.labService
      .findById(createDoctorDto.lab)
      .catch(err => {
        let error = err.message;
        if (err.name === 'CastError' && err.path === '_id') {
          error = 'Błędny identyfikator pracowni ' + createDoctorDto.lab;
        }
        throw new BadRequestException(error);
      });
    if (!lab) {
      throw new BadRequestException(
        'Pracownia przypisana do obsługi lekarza nie istnieje'
      );
    }
    await this.labService.incrementUsers(createDoctorDto.lab);

    const _createDoctorDto: CreateDoctorDto = {
      ...createDoctorDto,
      active: false,
      lab: lab._id,
      role: Role.doctor,
      //TODO przy tworzeniu lekarza nie ma hasla przeciez - nigdy tego nie przetestowales
      password: createDoctorDto.password ? await this.authService.hash(createDoctorDto.password) : await this.authService.hash(crypto.randomBytes(20).toString('hex'))
    } 
    //TODO ten lodash to trzeba zmienic na cos innego
    console.warn('zrobic cos z lodashem');
    return _.pick(await this.userService.addDoctor(_createDoctorDto), [
      '_id',
      'email',
      'role',
      'firstName',
      'lastName',
      'qualificationsNo'
    ]);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin','user')
  @Put(':id')
  async updateDoctor(@Body() updateDoctorDto: UpdateDoctorDto, @Param('id') id: string, @Request() req) {
    if (id !== updateDoctorDto._id ) {
      throw new BadRequestException('Błędne dane lekarza i żądania');        
    }
    const doctor: User = await this.userService.findById(id);

    if (!doctor) {
      throw new BadRequestException('Lekarz nie istnieje');
    } 

    const laboratory: Lab = await this.labService
      .findById(updateDoctorDto.lab)
      .catch(err => {
        let error = err.message;
        if (err.name === 'CastError' && err.path === '_id') {
          error = 'Błędny identyfikator pracowni ' + updateDoctorDto.lab;
        }
        throw new BadRequestException(error);
      });
    if (!laboratory) {
      throw new BadRequestException(
        'Pracownia przypisana do obsługi lekarza nie istnieje'
      );
    }
    
    const _updateDoctorDto: UpdateDoctorDto = {
      _id: updateDoctorDto._id,
      email: updateDoctorDto.email,
      role: updateDoctorDto.role,
      active: updateDoctorDto.active,
      rulesAccepted: updateDoctorDto.rulesAccepted,
      firstName: updateDoctorDto.firstName,
      lastName: updateDoctorDto.lastName,
      officeName: updateDoctorDto.officeName,   
      officeAddress: updateDoctorDto.officeAddress,
      qualificationsNo: updateDoctorDto.qualificationsNo,
      officeCorrespondenceAddres: updateDoctorDto.officeCorrespondenceAddres,
      examFormat: updateDoctorDto.examFormat,
      tomographyWithViewer: updateDoctorDto.tomographyWithViewer,
      lab :  laboratory._id
    } 
    return await this.userService.update(_updateDoctorDto);
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
          const _updateUserInternalDto: UpdateUserInternalDto = {
            _id: user._id,
            email: user.email,
            role: user.role,
            active: true
          };
          const { n, nModified, ok } = await this.userService.update(_updateUserInternalDto);
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
          const _updateUserInternalDto: UpdateUserInternalDto = {
            _id: user._id,
            email: user.email,
            role: user.role,
            rulesAccepted: true
          };
          const { n, nModified, ok } = await this.userService.update(_updateUserInternalDto);
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
