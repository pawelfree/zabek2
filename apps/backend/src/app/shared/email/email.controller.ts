import { Controller, UseGuards, Get, Query, BadRequestException, InternalServerErrorException } from '@nestjs/common';
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
  async sendExamNotification( @Query('examId') examId: string ): Promise<boolean> {
    //TODO przerobic na tak jak powinno byc z async/await a nie z then catch
    return await this.examService.findById(examId)
      .then(async exam => {
        if (!exam) {
          throw new BadRequestException('Badanie nie istnieje');
        } else {
          if (exam.sendEmailTo) {
            return this.emailService.sendExamNotification(exam.sendEmailTo)
          } else {
            await this.userService.findByDoctor(exam.doctor)
              .then(user => {
                if (user) {
                  return this.emailService.sendExamNotification(user.email);
                }
                return false;
              }
            )
            .catch(err => false)
          }
        }
      })
      .catch(err => { throw new InternalServerErrorException('Błąd wyszukiwania badania'); } );

  }

}