import { Controller, UseGuards, Get, Query, BadRequestException } from '@nestjs/common';
import { Roles } from '../security/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../security/roles.guard';
import { EmailService } from './email.service';
import { ExamService } from '../../exam/exam.service';
import { UserService } from '../../user/user.service';


@Controller('email')
export class EmailController {

  constructor(private readonly emailService: EmailService,
              private readonly examService: ExamService,
              private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'user')
  @Get()
  async sendExamNotification( @Query('examId') examId: string ) {
    //TODO nie wiem jak to dziala
    const exam = await this.examService.findById(examId);
    if (exam) {
      if (exam?.patient.processingAck) {
        const user = await this.userService.findByDoctor(exam.doctor);
        if (!user) {
          throw new BadRequestException('Nie można znaleźć email lekarza. (' + exam.doctor._id + ')')
        } else {
          if (user.rulesAccepted) {
            if (exam.sendEmailTo) {
              await this.emailService.sendExamNotification(exam.sendEmailTo);
              await this.examService.registerSentNotification(exam._id);
              return true;
            } else {
              await this.emailService.sendExamNotification(user.email);
              await this.examService.registerSentNotification(exam._id);            
              return true;
            }
          } else {
            await this.emailService.sendAccountNotification(user.email, user.lab._id);
            await this.examService.registerSentNotification(exam._id);            
            return true;      
          }
        }
      } else {
        throw new BadRequestException('Pacjent nie wyraził zgody na badania online')
      }
    } else { 
      throw new BadRequestException('Badanie nie istnieje');
    }

  }

}