
import { Module } from '@nestjs/common';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DoctorSchema } from './doctor.schema';

@Module({
  imports: [ 
    MongooseModule.forFeature([{name: 'Doctor', schema: DoctorSchema }])
  ],
  controllers: [
    DoctorController
  ],
  providers: [
    DoctorService
  ],
  exports: [
  ]
})
export class DoctorModule {}