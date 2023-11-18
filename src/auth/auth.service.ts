import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../user/user.repository';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcrypt';
import { throwException } from '../common/thrwoException.helper';
import {
  ActivateUser,
  ForgotPassword,
  ResetPasswordDto,
} from './dto/reset-password.dto';
import { EmailService } from '../mail/email.service';
import { Mail } from '../mail/resources/interfaces/mail.interface';
import { EmailSubject } from '../mail/resources/interfaces/mail.enum';
import { Status } from '../user/enums/status.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UserRepository,
    private jwtService: JwtService,
    private readonly _emailService: EmailService,
  ) {}

  async login(loginDto: LoginDto): Promise<object> {
    const user = await this.usersRepository.getUserByEmail(loginDto.email);

    if (user && (await bcrypt.compare(loginDto.password, user.password))) {
      const payload = { userId: user.id, role: user.role };
      return {
        user,
        access_token: await this.jwtService.signAsync(payload),
      };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async register(registerDto: RegisterDto) {
    try {
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      const user = new User();
      registerDto.password = hashedPassword;
      Object.assign(user, registerDto);
      const result = await this.usersRepository.saveUser(user);
      if (result) {
        const token = await this.generateToken(
          result.id,
          result.email,
          `${result.firstName} ${result.lastName}`,
        );

        const mail: Mail = {
          to: result.email,
          subject: EmailSubject.Authorize,
          html: `<b>Bienvenido al sistema, para autorizar su cuenta debe copiar y pegar su token de acceso al enpoint correspondiente. Su token es: ${token} </b>`,
        };

        await this._emailService.sendByTemplate(mail);
        return { user, token };
      } else {
        throw new Error('User not save');
      }
    } catch (error) {
      if (error.code === '23505') {
        throwException(HttpStatus.CONFLICT, 'Duplicate user');
      } else {
        throwException(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error');
      }
    }
  }

  async activateAccount(param: ActivateUser): Promise<boolean> {
    const { token } = param;

    if (await this.isValidToken(token)) {
      throwException(HttpStatus.NOT_ACCEPTABLE, 'Token is not valid');
    }

    const payload = await this.getPayload(token);

    if (payload === null) {
      throwException(HttpStatus.CONFLICT, 'Token is not valid');
    }

    const { userId, email, fullName } = payload;
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throwException(HttpStatus.NOT_FOUND, 'User not found');
    }

    user.status = Status.ACTIVE;
    const updateUser = await this.usersRepository.updateUser(userId, user);

    if (!updateUser) {
      throwException(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to update user');
    } else if (
      updateUser?.affected !== undefined &&
      updateUser.affected === 0
    ) {
      throwException(HttpStatus.BAD_REQUEST, 'User not activated');
    } else {
      const mail: Mail = {
        to: email,
        subject: EmailSubject.Welcome,
        html: `<b>Su cuenta ha quedado activado, ¡felicidades! </b>`,
      };
      await this._emailService.sendByTemplate(mail);
      return true;
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPassword): Promise<object> {
    const { email } = forgotPasswordDto;
    const user = await this.usersRepository.getUserByEmail(email);

    if (!user) {
      throwException(HttpStatus.NOT_FOUND, 'User not found');
    }

    const resetToken = await this.generateToken(
      user.id,
      email,
      `${user.firstName} ${user.lastName}`,
    );

    const mail: Mail = {
      to: user.email,
      subject: EmailSubject.PasswordReset,
      html: `<b>Para recupear su cuenta ingrese al endpoint utilizando este token de recuperación. Su token es: ${resetToken} </b>`,
    };
    await this._emailService.sendByTemplate(mail);
    return { resetToken };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { token, newPassword } = resetPasswordDto;
    const { email } = await this.getPayload(token);
    if (!email) {
      throwException(HttpStatus.NOT_FOUND, 'Email not found');
    }
    const user = await this.usersRepository.getUserByEmail(email);

    if (!user) {
      throwException(HttpStatus.NOT_FOUND, 'User not found');
    }

    if (await this.isValidToken(token)) {
      throwException(
        HttpStatus.NOT_ACCEPTABLE,
        'User reset token is not valid',
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await this.usersRepository.saveUser(user);
    const mail: Mail = {
      to: user.email,
      subject: EmailSubject.ResetPassword,
      html: `<b>Contraseña restablecida </b>`,
    };
    await this._emailService.sendByTemplate(mail);
  }

  async generateToken(
    userId: number,
    email: string,
    fullName: string,
  ): Promise<string> {
    const payload = { userId, email, fullName };

    const tokenOptions = {
      expiresIn: '1h',
    };

    const resetToken = this.jwtService.sign(payload, tokenOptions);
    return resetToken;
  }

  async isValidToken(encodedToken: string): Promise<boolean> {
    try {
      const payload = this.jwtService.verify(encodedToken);

      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp > currentTimestamp) {
        return false;
      }
      return true;
    } catch (error) {
      return true;
    }
  }

  async getPayload(
    encodedToken: string,
  ): Promise<{ userId: number; email: string; fullName: string } | null> {
    try {
      const payload = this.jwtService.verify(encodedToken) as {
        userId: number;
        email: string;
        fullName: string;
      };
      return payload;
    } catch (error) {
      return null;
    }
  }
}
