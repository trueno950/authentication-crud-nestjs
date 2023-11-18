import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPassword {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'reset_token' })
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    example: 'P@ssw0rd',
    description:
      'The password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.',
  })
  @IsNotEmpty()
  @Length(8, 20)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/, {
    message:
      'The password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.',
  })
  newPassword: string;
}

export class ActivateUser {
  @ApiProperty({ example: 'activation_token' })
  @IsNotEmpty()
  token: string;
}
