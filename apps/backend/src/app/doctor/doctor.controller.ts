import { Controller, 
  Post, 
  Body,
  BadRequestException} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateDoctorDto } from './dto/createdoctor.dto';
import { Doctor } from './doctor.interface';
import { DoctorService } from './doctor.service';
import * as _ from 'lodash';

@Controller('doctor')
export class DoctorController {

  constructor(
    private readonly doctorService: DoctorService
  ) {}

  static SALT = 10;

  @Post()
  async addDoctor(@Body() createDoctorDto: CreateDoctorDto) {
    const user: Doctor = await this.doctorService.findByEmail(createDoctorDto.email);
    if (user) {
      throw new BadRequestException('Lekarz jest już zarejestrowany');
    }
    const salt = await bcrypt.genSalt(DoctorController.SALT);
    const _createDoctorDto = {
      ...createDoctorDto,
      _id: null,
      active: false,
      password: await bcrypt.hash(createDoctorDto.password, salt)
    } 
    console.log(_createDoctorDto)
    //TODO ten lodash to trzeba zmienic na cos innego
    return _.pick(await this.doctorService.add(_createDoctorDto), [
      'email', 'firstName', 'lastName', 'qualificationsNo'
    ]);
  }
}