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
  ParseIntPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../shared/security/roles.decorator';
import { Role } from '../shared/role';
import { RolesGuard } from '../shared/security/roles.guard';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/feedback.create.dto';
import { EmailService } from '../shared/email/email.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService,
    private readonly emailService: EmailService) {}
  
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('sadmin')
  @Get()
  async allFeedbacks(
    @Query('pagesize', new ParseIntPipe()) pagesize: number,
    @Query('page', new ParseIntPipe()) page: number,
    @Request() req
  ) {
    return await this.feedbackService.findAllFeedbacks(pagesize, page, req.user.lab);
  }

  // Zapisanie uwag uytkownika w bazie oraz wysanie wiadomosci email do uzytkownika
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('doctor')
  @Post()
  async addFeedback(@Body() createFeedbackDto: CreateFeedbackDto, @Request() req) {
    return await this.feedbackService.add({...createFeedbackDto, lab: req.user.lab}).
    then( () =>
      this.emailService.sendUserFeedbackEmail(req.user.email)
    );
  }

}
