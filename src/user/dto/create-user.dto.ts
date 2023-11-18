import { IsNotEmpty, IsEmail, Length, Matches } from 'class-validator';
import { RoleName } from '../../role/enums/roles.enum';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(3, 50)
  firstName: string;

  @IsNotEmpty()
  @Length(3, 50)
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Length(8, 20)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/, {
    message: 'The password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.'
  })
  password: string;

  @IsNotEmpty()
  @Length(3, 50)
  role: RoleName;
}
