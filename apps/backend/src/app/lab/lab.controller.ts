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
    ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../shared/security/roles.decorator';
import { RolesGuard } from '../shared/security/roles.guard';
import { LabService } from './lab.service';
import { CreateLabDto, UpdateLabDto } from './dto';
import { Lab } from '@zabek/data';

@Controller('lab')
export class LabController {
  constructor(
    private readonly labService: LabService
  ) {}

    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    // @Roles('sadmin', 'admin')
    @Get()
    async allLabs(
      @Query('pagesize', new ParseIntPipe()) pagesize: number,
      @Query('page', new ParseIntPipe()) page: number
    ) {
      return await this.labService.findAll(pagesize, page);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('sadmin')
    @Post()
    async addLab(@Body() createLabDto: CreateLabDto) {
      const lab: Lab = await this.labService.findByName(createLabDto.name);
      if (lab) {
        throw new BadRequestException('Pracownia już istnieje');
      }
      return await this.labService.add({ ...createLabDto, usersCount: 0});
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

    @Get(':id')
    async getLab(@Param('id') id: string) {
      return await this.labService.findById(id);
    }   

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('sadmin')
    @Delete(':id')
    async deleteLab(@Param('id') id: string) {
      
      if (!await this.labService.delete(id)) {
        throw new BadRequestException('Nie można usunąć pracowni, która ma użytkowników');
      }
    }

}