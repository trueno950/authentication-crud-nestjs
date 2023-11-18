import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleName } from '../role/enums/roles.enum';
import { Role } from '../role/role.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async getUserByEmail(email: string): Promise<User | undefined> {
    return await this.usersRepository.findOne({ where: { email } });
  }

  async saveUser(user: User): Promise<User> {
    if (!user.role) {
      const defaultRole = await this.roleRepository.findOneBy({
        name: RoleName.User,
      });
      user.role = defaultRole;
    }
    return await this.usersRepository.save(user);
  }

  async findById(id: number): Promise<User | undefined> {
    return await this.usersRepository.findOne({ where: { id: id } });
  }

  async updateUser(id: number, data: User) {
    return await this.usersRepository.update({ id }, data);
  }
}
