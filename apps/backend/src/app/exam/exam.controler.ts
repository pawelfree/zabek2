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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ExamService } from './exam.service';
import { CreateExamDto } from './dto/createexam.dto';
import { UpdateExamDto } from './dto/updateexam.dto';
import { Exam } from './exam.interface';
  
  
  @Controller('exam')
  export class ExamController {
    constructor(
      private readonly examService: ExamService
    ) {}

  
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('sadmin','admin','user')
    @Get()
    async allExams(
      @Query('pagesize') pagesize: number,
      @Query('page') page: number
    ) {
      return await this.examService.findAll(+pagesize, +page);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin','user')
    @Post()
    async addExam(@Body() createExamDto: CreateExamDto) {
      return await this.examService.add(createExamDto);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin','user')
    @Put(':id')
    async updateExam(@Body() updateExamDto: UpdateExamDto, @Param('id') id: string) {
      if (id !== updateExamDto._id ) {
        throw new BadRequestException('Błędne dane badania i żądania');        
      }
      const exam: Exam = await this.examService.findById(id);
      if (!exam) {
        throw new BadRequestException('Badanie nie istnieje');
      }
      return await this.examService.update(updateExamDto);
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
  