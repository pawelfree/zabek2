import { Controller, 
  Post, 
  Body,
  BadRequestException,
  Put,
  UseGuards,
  Param,
  InternalServerErrorException,
  Get,
  Query,
  Request} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';
import { UserService } from './user.service';
import { User } from './user.interface';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UpdateUserInternalDto, CreateDoctorDto } from './dto';
import { Role } from '../shared/role';
import { LabService } from '../lab/lab.service';
import { Lab } from '../lab/lab.interface';

@Controller('doctor')
export class DoctorController {

  constructor(
    private readonly userService: UserService,
    private readonly labService: LabService
  ) {}

  static SALT = 10;

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.sadmin, Role.admin, Role.user)
  @Get()
  async allUsers(
    @Query('pagesize') pagesize: number = 0,
    @Query('page') page: number = 10,
    @Request() req
  ) {
    return await this.userService.findAllDoctors(+pagesize, +page, req.user.lab);
  }

  @Post()
  async addDoctor(@Body() createDoctorDto: CreateDoctorDto) {
    const user: User = await this.userService.findByEmail(createDoctorDto.email);
    if (user) {
      throw new BadRequestException('Lekarz jest już zarejestrowany');
    }
    const lab: Lab = await this.labService.findById(createDoctorDto.lab._id).catch(err =>
      { 
        let error = err.message;
        if (err.name === 'CastError' && err.path === '_id') {
          error = 'Błędny identyfikator pracowni ' + createDoctorDto.lab._id;
        }
        throw new BadRequestException(error) }
    );
    if(! lab) {
      throw new BadRequestException('Pracownia przypisana do obsługi lekarza nie istnieje')
    }
    const salt = await bcrypt.genSalt(DoctorController.SALT);
    const _createDoctorDto: CreateDoctorDto = {
      ...createDoctorDto,
      active: false,
      lab: lab,
      role: Role.doctor,
      password: await bcrypt.hash(createDoctorDto.password, salt)
    } 
    //TODO ten lodash to trzeba zmienic na cos innego
    console.warn('zrobic cos z lodashem')
    return _.pick(await this.userService.addDoctor(_createDoctorDto), [
      'email', 'role', 'firstName', 'lastName', 'qualificationsNo'
    ]);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.sadmin, Role.admin, Role.user)
  @Put('/activate/:id')
  async activateUser(@Param('id') id: string) {
    let error;
    await this.userService.findById(id)
      .then(async (user: User) => {
        if (!user) {
          error = new BadRequestException('Lekarz nie istnieje.');
        } else if (user.active) {
          error = new BadRequestException('Lekarz jest już aktywny.');
        } else {
          const _updateUserInternalDto: UpdateUserInternalDto = {
            _id: user._id,
            email: user.email,
            role: user.role,
            active: !user.active
          };
          const {n, nModified, ok} = await this.userService.update(_updateUserInternalDto);
          if ( n !== 1 || nModified !== 1 || ok !== 1 ) {
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