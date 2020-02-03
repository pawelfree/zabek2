import {
  Controller,  
  Get,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../shared/security/roles.decorator';
import { RolesGuard } from '../shared/security/roles.guard';
import { ExamService } from './exam.service';
import { UserService } from '../user/user.service';

  @Controller('doctor-exam')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('doctor')
  export class DoctorExamController {
    constructor(
      private readonly examService: ExamService,
      private readonly userService: UserService
    ) {}

    @Get()
    async allExamsForCurrentDoctorUser(
      @Query('pagesize', new ParseIntPipe()) pagesize: number,
      @Query('page', new ParseIntPipe()) page: number,
      @Request() req
    ) {

      const user = await this.userService.findById(req.user._id)
      if (!user) {
        return new BadRequestException('Użytkownik nie istnieje - nie można pobrać dla niego badań')
      }
      return await this.examService.findAllExamsForDoctor(pagesize, page, user.doctor);
    }
   
    @Get(':id')
    async getExam(@Param('id') id: string) {
      return this.examService.findById(id);
    }   
  }  