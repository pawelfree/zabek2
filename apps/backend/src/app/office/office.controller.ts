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
import { OfficeService } from './office.service';

@Controller('office')
export class OfficeController {
  constructor(
    private readonly officeService: OfficeService
  ) {}

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('sadmin')
    @Get()
    async allOffices(
      @Query('pagesize') pagesize: number,
      @Query('page') page: number
    ) {
      return await this.officeService.findAll(+pagesize, +page);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('sadmin')
    @Post()
    async addOffice() {
        console.log('add office');
        return {office: 'add'};
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('sadmin')
    @Delete(':id')
    async getOffice(@Param('id') id: string) {
      console.log('get office' + id);
      return { office: 'get ' + id};
    }   

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('sadmin')
    @Delete(':id')
    async deleteOffice(@Param('id') id: string) {
      console.log('delete office' + id);
      return {office: 'delete'};
    }

}