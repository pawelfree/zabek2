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
  Request
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../shared/security/roles.decorator';
import { Role } from '../shared/role';
import { RolesGuard } from '../shared/security/roles.guard';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/feedback.create.dto';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}
  
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('sadmin')
  @Get()
  async allFeedbacks(
    @Query('pagesize') pagesize: number,
    @Query('page') page: number,
    @Request() req
  ) {
    return await this.feedbackService.findAllFeedbacks(+pagesize, +page, req.user.lab);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('doctor')
  @Post()
  async addExam(@Body() createFeedbackDto: CreateFeedbackDto, @Request() req) {
    return await this.feedbackService.add({...createFeedbackDto, lab: req.user.lab});
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.sadmin, Role.admin, Role.user, Role.doctor)
  @Put('/send/:feedback')
  async sendFeedback(@Param('feedback') feedback: string) {
  }
}
