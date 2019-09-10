
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import * as jsonwebtoken from 'jsonwebtoken';
import { User } from '../user/user.interface';
import { ConfigService } from '../config/config.service';

@Injectable()
export class AuthService {
  constructor(
     private readonly userService: UserService,
     private readonly configService: ConfigService
  ) {}

  async validateUser(email: string, pass: string): Promise<{user: User, message: string}> {
    const user = await this.userService.findByEmail(email);

    if (user) {
      const validPassword = await bcrypt.compare(pass, user.password);
      if (validPassword) {
        return { user: user , message: null };
      }
      return { user: null, message: 'INVALID_PASSWORD'};
    }
    return { user: null, message: 'EMAIL_NOT_FOUND' };
  }

  async login(user: User) {
    const payload = { email: user.email, _id: user._id, role: user.role};
    return { 
      _id: user._id,
      email: user.email,
      role: user.role,
      expiresIn: this.configService.get('loginExpiresIn'),
      token: jsonwebtoken.sign(payload, this.configService.get('JWT_PRIVATE_KEY'), { expiresIn: this.configService.get('loginExpiresIn') })
    };
  }
}