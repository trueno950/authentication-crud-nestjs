import {
  Controller,
  Post,
  Patch,
  Body,
  Res,
  HttpStatus,
  Get,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  LoginDto,
  RegisterDto,
  ActivateUser,
  ForgotPassword,
  ResetPasswordDto,
} from './dto/index';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Login successful' })
  async login(@Body() loginDto: LoginDto, @Res() res): Promise<void> {
    const accessToken = await this.authService.login(loginDto);
    res.status(HttpStatus.OK).json({ ...accessToken, code: HttpStatus.OK });
  }

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'User created' })
  async register(@Body() registerDto: RegisterDto, @Res() res): Promise<void> {
    const user = await this.authService.register(registerDto);
    res
      .status(HttpStatus.CREATED)
      .json({ message: 'User created', data: user, code: HttpStatus.CREATED });
  }

  @Get('activate/:token')
  @ApiOperation({ summary: 'Activate user account' })
  @ApiParam({ name: 'token', description: 'Activation token' })
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'User account activated',
  })
  async activateAccount(
    @Param() param: ActivateUser,
    @Res() res,
  ): Promise<void> {
    const response = await this.authService.activateAccount(param);
    res
      .status(HttpStatus.ACCEPTED)
      .json({ message: 'User activate', response, code: HttpStatus.ACCEPTED });
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Initiate password reset' })
  @ApiBody({ type: ForgotPassword })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password reset token sent',
  })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPassword,
    @Res() res,
  ): Promise<void> {
    const token = await this.authService.forgotPassword(forgotPasswordDto);
    res
      .status(HttpStatus.OK)
      .json({ message: 'Password reset token sent', token });
  }

  @Patch('reset-password')
  @ApiOperation({ summary: 'Reset user password' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Password reset successful',
  })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Res() res,
  ): Promise<void> {
    await this.authService.resetPassword(resetPasswordDto);
    res.status(HttpStatus.OK).json({ message: 'Password reset successful' });
  }
}
