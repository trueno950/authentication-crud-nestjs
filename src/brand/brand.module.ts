import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';

import { Module } from '@nestjs/common';
import { BrandRepository } from './brand.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './brand.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Brand])],
  controllers: [BrandController],
  providers: [BrandService, BrandRepository, JwtService],
})
export class BrandModule {}
