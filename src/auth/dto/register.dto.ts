import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { LoginDto } from './login.dto';
import { RoleName } from '../../role/enums/roles.enum';

export class RegisterDto extends PartialType(LoginDto) {
  @ApiProperty({ example: 'John', description: 'The first name of the user' })
  @IsNotEmpty()
  @Length(3, 50)
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'The last name of the user' })
  @IsNotEmpty()
  @Length(3, 50)
  lastName: string;

  @ApiProperty({
    example: 'user',
    description: 'The role of the user (optional)',
    required: false,
  })
  @IsOptional()
  @Length(3, 50)
  role: RoleName;
}
