import { Controller, 
        UseGuards, 
        Post, 
        BadRequestException, 
        InternalServerErrorException, 
        Request, 
        Body,
        Param} from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../shared/security/roles.decorator';
import { Role } from '../shared/role';
import { RolesGuard } from '../shared/security/roles.guard';
import { ChangePasswordDto } from './dto';
import { AuthService } from '../shared/security/auth.service';
import { UserService } from '../user/user.service';
import { isValidEmail } from '@zabek/util';
import { EmailService } from '../shared/email/email.service';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly mailService: EmailService
  ) {}

  @Post('passwordreset/:id')
  async resetPassword(@Param('id') encodedToken: string, @Body() body: {password: string}) {
    console.warn('wymusic polityke haseł')
    if (!body || !body.password) {
      throw new BadRequestException('Hasło nie może być puste');
    }
    const {token, error} = this.authService.decodeResetPasswordToken(encodedToken);

    if (error) {
      if (error.name.includes('TokenExpiredError')) {
        throw new BadRequestException('Upłynął termin ważności (tokenu) żądania zmiany hasła');
      }
      else {
        throw new BadRequestException('Niepoprawny token zmiany hasła', error.name + ' | ' + error.message);
      }
    }
    const reset = {
      _id: token['_id'],
      password : await this.authService.hash(body.password)
    }
    const {n, nModified, ok} = await this.userService.update(reset);
    if ( n !== 1 || nModified !== 1 || ok !== 1 ) {
      throw new InternalServerErrorException('Nieznany błąd');
    }    
  } 
  
  @Post('passwordreset')
  async forgotPassword(@Body() body: { email: string }) {
    if (!body || !body.email || ! isValidEmail(body.email)) {
      throw new BadRequestException('Email nie może być pusty')
    }
    const token: string = await this.authService.resetPasswordToken(body.email);
    if (token) {
      this.mailService.sendResetTokenSuccesEmail(body.email,token);
    } else {
      this.mailService.sendResetTokenSuccesFailureEmail(body.email);
    }
    return true;
  }

  @UseGuards(AuthGuard('local'))
  @Post('authenticate')
  async authenticate(@Request() req) {
    const userData = await this.authService.login(req.user);
    return userData;
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(Role.sadmin, Role.admin, Role.user, Role.doctor)
  @Post('changepassword')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Request() req){
    console.warn('wymusic polityke haseł')
    if (!changePasswordDto.newPassword || ! changePasswordDto.oldPassword) {
      throw new BadRequestException('Brak danych wejściowych');
    }
    let error = null;
    await this.authService.validateUser(req.user.email, changePasswordDto.oldPassword)
      .then(async ({ user , message}) => {
        if (!user) {
          error = new BadRequestException(message);
        } else {
          const {n, nModified, ok} = await this.userService.update({
            _id: user._id,
            password: await this.authService.hash(changePasswordDto.newPassword)
          });
          if ( n !== 1 || nModified !== 1 || ok !== 1 ) {
            error = new InternalServerErrorException('Nieznany błąd');
          } 
        }
      })
      .catch(err => {
        error = new BadRequestException(err);
      });

      if (error) {
        throw error;
      }
  }
}