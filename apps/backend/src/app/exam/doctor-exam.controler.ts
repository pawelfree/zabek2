import {
  Controller,  
  Get,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../shared/security/roles.decorator';
import { RolesGuard } from '../shared/security/roles.guard';
import { ExamService } from './exam.service';

  @Controller('doctor-exam')
  export class DoctorExamController {
    constructor(
      private readonly examService: ExamService
    ) {
      console.warn('Sprawdzic przekazywanie labow jako obiektow lub id')
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('doctor')
    @Get()
    async allExamsForCurrentDoctorUser(
      @Query('pagesize') pagesize: number,
      @Query('page') page: number,
      @Request() req
    ) {
      return await this.examService.findAllExamsForDoctor(+pagesize, +page, req.user);
    }
   
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('doctor')
    @Get(':id')
    async getExam(@Param('id') id: string) {
      return this.examService.findById(id);
    }   
  }  