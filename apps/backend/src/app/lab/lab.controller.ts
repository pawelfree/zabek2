import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../shared/security/roles.decorator';
import { RolesGuard } from '../shared/security/roles.guard';
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
      let lab: Lab = await this.labService.findById(id);
      if (!lab) {
        throw new BadRequestException('Pracownia nie istnieje');
      }
      lab = await this.labService.findByName(updateLabDto.name)
      if (lab && lab._id.toString() !== updateLabDto._id) {
        throw new BadRequestException('Istnieje inna pracownia o tej nazwie');
      }
      return await this.labService.update(updateLabDto);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('sadmin')
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