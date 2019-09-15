import { Controller, 
  Post, 
  Body,
  BadRequestException,
  Put,
  UseGuards,
  Param,
  InternalServerErrorException} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateDoctorDto } from './dto/createdoctor.dto';
import * as _ from 'lodash';
import { UserService } from './user.service';
import { User } from './user.interface';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UpdateUserInternalDto } from './dto';

@Controller('doctor')
export class DoctorController {

  constructor(
    private readonly userService: UserService
  ) {}

  static SALT = 10;

  @Post()
  async addDoctor(@Body() createDoctorDto: CreateDoctorDto) {
    const user: User = await this.userService.findByEmail(createDoctorDto.email);
    if (user) {
      throw new BadRequestException('Lekarz jest już zarejestrowany');
    }
    const salt = await bcrypt.genSalt(DoctorController.SALT);
    const _createDoctorDto = {
      ...createDoctorDto,
      _id: null,
      active: false,
      role: "doctor",
      password: await bcrypt.hash(createDoctorDto.password, salt)
    } 
    //TODO ten lodash to trzeba zmienic na cos innego
    return _.pick(await this.userService.addDoctor(_createDoctorDto), [
      'email', 'role', 'firstName', 'lastName', 'qualificationsNo'
    ]);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'sadmin', 'user')
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