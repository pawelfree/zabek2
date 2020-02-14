import {
  Controller,  
  Get,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
  BadRequestException,
  Put,
  Body,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../shared/security/roles.decorator';
import { RolesGuard } from '../shared/security/roles.guard';
import { ExamService } from './exam.service';
import { UserService } from '../user/user.service';
import { Examination } from '@zabek/data';
import { noop } from 'rxjs';

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

    @Put(':id')
    async setDowlnoadedDate(@Param('id') id: string, @Body() downloadDateObj: {downloadDate: string}) {
      const exam = await this.examService.findById(id);
      if (exam) {
        //TODO to przepisywanie musi byc jako prostsze
        
        let newExam: Examination = null;
        if (exam.firstDownload) {
          newExam = {
            _id: exam._id,
            doctor: exam.doctor,
            lab: exam.lab,
            examinationDate: exam.examinationDate,
            examinationType: exam.examinationType,
            sendEmailTo: exam.sendEmailTo,
            file: exam.file,
            patient: exam.patient,
            lastDownload: downloadDateObj.downloadDate };
        } else {
          newExam = {
            _id: exam._id,
            doctor: exam.doctor,
            lab: exam.lab,
            examinationDate: exam.examinationDate,
            examinationType: exam.examinationType,
            sendEmailTo: exam.sendEmailTo,
            file: exam.file,
            patient: exam.patient,
            firstDownload: downloadDateObj.downloadDate, 
            lastDownload: downloadDateObj.downloadDate };
        }

        this.examService.update(newExam).then(noop).catch(err => console.log('error updating download date',err))

      }

    }
  }  