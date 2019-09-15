import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { MongooseModule } from '@nestjs/mongoose';
import { LabModule } from './lab/lab.module';
import { ExamModule } from './exam/exam.module';


@Module({
  imports: [ 
    AuthModule,
    LabModule,
    UserModule, 
    ExamModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
        useNewUrlParser: true
      }),
      inject: [ConfigService],
    })
   ],
  exports: [ MongooseModule ]
})
export class AppModule {}