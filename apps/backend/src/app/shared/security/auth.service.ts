import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/user.service';
import * as bcrypt from 'bcrypt';
import * as jsonwebtoken from 'jsonwebtoken';
import { User, Role } from '@zabek/data';
import { ConfigService } from '../../config/config.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService
  ) {}

  decodeToken(encodedToken: string, type: 'reset' | 'register' = 'reset'): {token: Object, error: {name: string, message: string}} {
    let error = null;
    let token = null;
    try {
      token = jsonwebtoken.verify(encodedToken, this.configService.get('JWT_PRIVATE_KEY') );
      if (token.type !== type) {
        token = null,
        error = { name: 'Błąd weryfikacji tokena.', message: 'To nie jest token typu ' + type + '.'}
      }
    } catch(err) {
      error = err;
    }
    return { token, error };
  }
  
  encodeToken(email: string, type: 'reset' | 'register' = 'reset') {

    let expiresIn = +this.configService.get('RESET_TOKEN_EXPIRES_IN');
    if (type === 'reset') {
      expiresIn = +this.configService.get('REGISTER_TOKEN_EXPIRES_IN');
    }

    return this.userService.findByEmail(email,null)
      .then(async(user) => {
        return await jsonwebtoken.sign({ _id: user._id, email: user.email, type }, this.configService.get('JWT_PRIVATE_KEY'), { expiresIn });
      })
      .catch(_ => {
        return  null;
      })
  }

  async hash(data: string) {
    const salt = await bcrypt.genSalt(this.configService.get('SALT'));    
    return bcrypt.hash(data, salt);
  }

  async validateUser(email: string, pass: string): Promise<{user: User, message: string}> {
    const user = await this.userService.findByEmailForLogin(email);

    if (user) {
      const validPassword = await bcrypt.compare(pass, user.password);
      if (validPassword) {
        if (user.role === Role.doctor && !user.active) {
          return { user: null, message: 'USER_NOT_ACTIVE'};
        }
        return { user: user , message: null };
      }
      return { user: null, message: 'INVALID_PASSWORD'};
    }
    return { user: null, message: 'EMAIL_NOT_FOUND' };
  }

  async login(user: User) {
    const payload = { email: user.email,
       _id: user._id, 
       role: user.role, 
       lab: user.lab};
    return { 
      _id: user._id,
      email: user.email,
      role: user.role,
      lab: user.lab,
      expiresIn: +this.configService.get('LOGIN_EXPIRES_IN'),
      rulesAccepted: user.rulesAccepted === null ? false : user.rulesAccepted,
      active: user.active === null ? false : user.active,
      token: jsonwebtoken.sign(payload, this.configService.get('JWT_PRIVATE_KEY'), { expiresIn: +this.configService.get('LOGIN_EXPIRES_IN') })
    };
  }
}