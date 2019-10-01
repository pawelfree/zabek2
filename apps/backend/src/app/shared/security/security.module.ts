import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { UserService } from '../../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '../../user/user.schema';
import { ConfigModule } from '../../config/config.module';
import { ConfigService } from '../../config/config.service';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'User', schema: UserSchema }]),
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_PRIVATE_KEY'),
      }),
      inject: [ConfigService]
    })
  ],
  providers: [UserService, AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService]
})
export class SecurityModule {}
