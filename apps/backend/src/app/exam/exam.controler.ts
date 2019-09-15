import {
    Controller,
    UseGuards,
    Get,
    Query,
    Delete,
    Param
  } from '@nestjs/common';
  import { AuthGuard } from '@nestjs/passport';
  import { ExamService } from './exam.service';
  import { Roles } from '../auth/roles.decorator';
  import { RolesGuard } from '../auth/roles.guard';
  import * as _ from 'lodash';
  
  
  @Controller('exam')
  export class ExamController {
    constructor(
      private readonly examService: ExamService
    ) {}

  
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('admin', 'sadmin', 'user')
    @Get()
    async p4(
      @Query('pagesize') pagesize: number,
      @Query('page') page: number
    ) {
      return await this.examService.findAll(+pagesize, +page);
    }
    
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('sadmin', 'user', 'admin')
    @Delete(':id')

    async deleteLab(@Param('id') id: string) {
      //TODO zabronic usuwania takich z uzytkownikami i badaniami
      return this.examService.delete(id);
    }

  }
  