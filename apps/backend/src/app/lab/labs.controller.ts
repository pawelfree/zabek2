import {
    Controller,
    Get,
    UseGuards,
    Query
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../shared/security/roles.decorator';
import { RolesGuard } from '../shared/security/roles.guard';
import { LabService } from './lab.service';
import { environment } from '../../environments/environment';

@Controller('labs')
export class LabsController {
  constructor(
    private readonly labService: LabService
  ) {}

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('sadmin', 'admin')
    @Get()
    async labs(
      @Query('pagesize') pagesize: number = +environment.MAX_PAGE_SIZE,
      @Query('page') page: number = 0
    ) {
      const size = (+pagesize > +environment.MAX_PAGE_SIZE) ? +environment.MAX_PAGE_SIZE : +pagesize;
      return await this.labService.findAll(size, +page);      
    }

}