import { Module } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import { EmailService } from './email.service';

@Module({
  imports: [],
  providers: [ConfigService],
  exports: [EmailService]
})
export class EmailModule {}
