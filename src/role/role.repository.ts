import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleName } from './enums/roles.enum';
import { Role } from './role.entity';

@Injectable()
export class RoleRepository {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}
  
  async getRoleByName(name: string): Promise<Role | undefined> {
    return await this.roleRepository.findOne({ where: { name } });
  }

  async saveRole(role: Role): Promise<Role> {
    return await this.roleRepository.save(role);
  }

  async findById(id: number): Promise<Role | undefined> {
    return await this.roleRepository.findOne({ where: { id: id } });
  }

  async findByName(name: RoleName): Promise<Role | undefined> {
    return await this.roleRepository.findOne({ where: { name: name } });
  }
}
