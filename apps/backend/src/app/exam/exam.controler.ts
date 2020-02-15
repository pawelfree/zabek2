import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../shared/security/roles.decorator';
import { RolesGuard } from '../shared/security/roles.guard';
import { ExamService } from './exam.service';
import { CreateExamDto } from './dto';
import { Examination } from '@zabek/data';
  
  @Controller('exam')
  export class ExamController {
    constructor(private readonly examService: ExamService) {}

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('sadmin','admin','user')
    @Get()
    async allExams(
      @Query('pagesize', new ParseIntPipe()) pagesize: number,
      @Query('page', new ParseIntPipe()) page: number,
      @Request() req
    ) {
      return await this.examService.findAllExams(pagesize, page, req.user.lab);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin','user')
    @Post()
    async addExam(@Body() createExamDto: CreateExamDto, @Request() req) {
      return await this.examService.add({...createExamDto, lab: req.user.lab});
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin')
    @Put(':id')
    async updateExam(@Body() exam: Examination, @Param('id') id: string) {
      //TODO ta metoda robi bez sensu findbyid - findoneandupdate?
      if (id !== exam._id ) {
        throw new BadRequestException('Błędne dane badania i żądania');        
      }
      const newExam: Examination = await this.examService.findById(id);
      if (!newExam) {
        throw new BadRequestException('Badanie nie istnieje');
      }
      return await this.examService.update(exam);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin','user')
    @Get(':id')
    async getExam(@Param('id') id: string) {
      return this.examService.findById(id);
    }   

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('sadmin','admin')
    @Delete(':id')
    async deleteExam(@Param('id') id: string) {
      //TODO zdefinowac kto i kiedy moze usuwac
      return this.examService.delete(id);
    }

  }
  