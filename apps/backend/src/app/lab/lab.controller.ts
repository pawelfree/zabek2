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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { LabService } from './lab.service';
import { CreateLabDto, UpdateLabDto } from './dto';
import { Lab } from './lab.interface';

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
    async addLab(@Body() createLabDto: CreateLabDto) {
      const lab: Lab = await this.labService.findByName(createLabDto.name);
      if (lab) {
        throw new BadRequestException('Pracownia już istnieje');
      }
      return await this.labService.add(createLabDto);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('sadmin')
    @Put(':id')
    async updateLab(@Body() updateLabDto: UpdateLabDto, @Param('id') id: string) {
      if (id !== updateLabDto._id ) {
        throw new BadRequestException('Błędne dane pracowni i żądania');        
      }
      const lab: Lab = await this.labService.findById(id);
      if (!lab) {
        throw new BadRequestException('Pracownia nie istnieje');
      }
      return await this.labService.update(updateLabDto);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('sadmin')
    @Get(':id')
    async getLab(@Param('id') id: string) {
      return this.labService.findById(id);
    }   

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('sadmin')
    @Delete(':id')
    async deleteLab(@Param('id') id: string) {
      //TODO zabronic usuwania takich z uzytkownikami i badaniami
      return this.labService.delete(id);
    }

}