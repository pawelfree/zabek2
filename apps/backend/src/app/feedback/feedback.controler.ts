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

@Controller('feedback')
export class FeedbackController {
  constructor() {}
  //

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.sadmin, Role.admin, Role.user, Role.doctor)
  @Put('/send/:feedback')
  async sendFeedback(@Param('feedback') feedback: string) {
    let error;
    // await this.userService
    //   .findById(id)
    //   .then(async (user: User) => {
    //     if (!user) {
    //       error = new BadRequestException('Lekarz nie istnieje.');
    //     } else {
    //       const _updateUserInternalDto: UpdateUserInternalDto = {
    //         _id: user._id,
    //         email: user.email,
    //         role: user.role,
    //         active: true
    //       };
    //       const { n, nModified, ok } = await this.userService.update(
    //         _updateUserInternalDto
    //       );
    //       if (n !== 1 || nModified !== 1 || ok !== 1) {
    //         error = new InternalServerErrorException('Nieznany błąd.');
    //       }
    //       this.emailService.sendUserActivatedEmail(user.email);
    //     }
    //   })
    //   .catch(err => {
    //     error = new BadRequestException(err);
    //   });
    this.emailService.sendUserActivatedEmail(user.email);
    if (error) {
      throw error;
    }
  }
}
