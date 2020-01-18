import {
  Controller,  
  Get,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../shared/security/roles.decorator';
import { RolesGuard } from '../shared/security/roles.guard';
import { ExamService } from './exam.service';

  @Controller('doctor-exam')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('doctor')
  export class DoctorExamController {
    constructor(
      private readonly examService: ExamService
    ) {
      console.warn('Sprawdzic przekazywanie labow jako obiektow lub id')
    }

    @Get()
    async allExamsForCurrentDoctorUser(
      @Query('pagesize', new ParseIntPipe()) pagesize: number,
      @Query('page', new ParseIntPipe()) page: number,
      @Request() req
    ) {
      return await this.examService.findAllExamsForDoctor(pagesize, page, req.user);
    }
   
    @Get(':id')
    async getExam(@Param('id') id: string) {
      return this.examService.findById(id);
    }   
  }  