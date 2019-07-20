
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import * as jsonwebtoken from 'jsonwebtoken';
import { User } from '../user/user.interface';

const JWT_PRIVATE_KEY = 'jwtPrivateKey'


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService) {}

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.userService.findByEmail(email);

    if (user) {
      const validPassword = await bcrypt.compare(pass, user.password);
      if (validPassword) {
        return user;
      }
    }
    return null;
  }


  async login(user: User) {
    const payload = { email: user.email, _id: user._id, role: user.role};
    return jsonwebtoken.sign(payload, JWT_PRIVATE_KEY);
  }
}