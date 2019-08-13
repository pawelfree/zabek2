import {
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Query,
    UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { LabService } from './lab.service';

@Controller('lab')
export class LabController {
  constructor(
    private readonly labService: LabService
  ) {}

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('sadmin')
    @Get()
    async allLabs(
      @Query('pagesize') pagesize: number,
      @Query('page') page: number
    ) {
      return await this.labService.findAll(+pagesize, +page);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('sadmin')
    @Post()
    async addLab() {
        console.log('add office');
        return {lab: 'add'};
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('sadmin')
    @Delete(':id')
    async getLab(@Param('id') id: string) {
      console.log('get office' + id);
      return { lab: 'get ' + id};
    }   

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('sadmin')
    @Delete(':id')
    async deleteLab(@Param('id') id: string) {
      console.log('delete office' + id);
      return {lab: 'delete'};
    }

}