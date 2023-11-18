import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './brand.entity';
import { Repository, Like, Between, FindManyOptions, Not } from 'typeorm';
import {
  FilterOperator,
  PaginateQuery,
  paginate,
  Paginated,
} from 'nestjs-paginate';
import { Status } from './enums/status.enum';

@Injectable()
export class BrandRepository {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}

  async findAll(query: PaginateQuery): Promise<Paginated<Brand>> {
    return paginate(query, this.brandRepository, {
      sortableColumns: ['id', 'name'],
      nullSort: 'last',
      defaultSortBy: [['name', 'DESC']],
      searchableColumns: ['id', 'name', 'createdAt', 'updatedAt'],
      select: ['name', 'createdAt', 'updatedAt'],
      filterableColumns: {
        name: [FilterOperator.EQ, FilterOperator.ILIKE],
        createdAt: [FilterOperator.BTW],
        updatedAt: [FilterOperator.BTW],
      },
    });
  }

  async findById(id: number): Promise<Brand | undefined> {
    return await this.brandRepository.findOne({ where: { id } });
  }

  async existBrand(name: string): Promise<boolean> {
    const product = await this.brandRepository.findOne({
      where: { name, status: Not(Status.DELETED) },
    });
    return product ? true : false;
  }

  async createBrand(brand: Brand): Promise<Brand> {
    const newBrand = await this.brandRepository.create(brand);
    return await this.brandRepository.save(newBrand);
  }

  async updateBrand(
    id: number,
    updatedBrandData: Partial<Brand>,
  ): Promise<Brand | undefined> {
    await this.brandRepository.update(id, updatedBrandData);
    return await this.brandRepository.findOne({ where: { id } });
  }

  async deleteBrand(id: number): Promise<void> {
    await this.brandRepository.delete(id);
  }
}
