import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Module } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { Product } from './product.entity';
import { Brand } from '../brand/brand.entity';
import { BrandRepository } from '../brand/brand.repository';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Brand])],
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, BrandRepository, JwtService],
})
export class ProductsModule {}
