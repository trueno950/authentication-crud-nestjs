import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from '../common/roles.decorador';

@Controller('users')
export class UserController {
  constructor(private usersService: UserService) {}
  
  @UseGuards(JwtAuthGuard)
  @Role('user')
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Role('user')
  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<User | undefined> {
    return this.usersService.getUserById(id);
  }
}
