import { Injectable, ConflictException } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly usersRepository: UserRepository,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;

    const existingUser = await this.usersRepository.getUserByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const user = new User();
    Object.assign(user, createUserDto);

    return this.usersRepository.saveUser(user);
  }

  async getUserById(id: number): Promise<User | undefined> {
    return this.usersRepository.findById(id);
  }
}
