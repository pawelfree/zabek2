import { Module, HttpModule } from '@nestjs/common';
import { ConfigService } from '../../config/config.service';
import { EmailService } from './email.service';

@Module({
  imports: [HttpModule],
  providers: [ConfigService],
  exports: [EmailService]
})
export class EmailModule {}
