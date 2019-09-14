import { Controller, 
  Post, 
  Body,
  BadRequestException} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateDoctorDto } from './dto/createdoctor.dto';
import * as _ from 'lodash';
import { UserService } from './user.service';
import { User } from './user.interface';

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
}