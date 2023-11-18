import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { jwtConstants } from './jwt.constants';
import { UserRepository } from '../user/user.repository';
import { EmailService } from '../mail/email.service';
import { RoleRepository } from '../role/role.repository';
import { Role } from '../role/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1 hours' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserRepository, RoleRepository, EmailService]
})
export class AuthModule {}
