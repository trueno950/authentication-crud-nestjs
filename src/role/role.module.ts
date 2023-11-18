import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleRepository } from './role.repository';
import { Module } from '@nestjs/common';
import { Role } from './role.entity';
import { RoleController } from './role.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RoleController],
  providers: [RoleRepository],
  exports: [],
})
export class RoleModule {}
