
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { UserService } from '../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
      UserModule, 
      PassportModule,
      JwtModule.register({
            secret: 'jwtPrivateKey'
        })
      ],
  providers: [UserService, AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService, ]
})
export class AuthModule {} 