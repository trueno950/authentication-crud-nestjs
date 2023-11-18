import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository, Like, Between, FindManyOptions, ILike, Equal } from 'typeorm';
import {
  FilterOperator,
  PaginateQuery,
  paginate,
  Paginated,
} from 'nestjs-paginate';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAll(query: PaginateQuery): Promise<Paginated<Product>> {
    return paginate(query, this.productRepository, {
      sortableColumns: [
        'id',
        'name',
        'barcode',
        'brand',
        'createdAt',
        'updatedAt',
      ],
      nullSort: 'last',
      defaultSortBy: [['name', 'DESC']],
      searchableColumns: [
        'id',
        'name',
        'barcode',
        'brand',
        'createdAt',
        'updatedAt',
      ],
      select: [
        'name',
        'description',
        'sellingPrice',
        'purchasePrice',
        'stockQuantity',
        'costingMethod',
        'barcode',
        'brand.(id)',
        'brand.(name)',
        'createdAt',
        'updatedAt',
      ],
      relations: ['brand'],
      filterableColumns: {
        name: [FilterOperator.EQ, FilterOperator.ILIKE],
        barcode: [FilterOperator.EQ],
        'brand.id': [FilterOperator.EQ],
        createdAt: [FilterOperator.BTW],
        updatedAt: [FilterOperator.BTW],
      },
    });
  }

  async findById(id: number): Promise<Product | undefined> {
    return await this.productRepository.findOne({ where: { id } });
  }

  async existProduct(barcode: string, brandId: number): Promise<boolean> {
    const product = await this.productRepository.findOne({
      where: { barcode: ILike(barcode), brand: { id: brandId } },
    });
    return product ? true : false;
  }

  async createProduct(product: Product): Promise<Product> {
    const newProduct = await this.productRepository.create(product);
    return await this.productRepository.save(newProduct);
  }

  async updateProduct(
    id: number,
    updatedProductData: Partial<Product>,
  ): Promise<Product | undefined> {
    await this.productRepository.update(id, updatedProductData);
    return await this.productRepository.findOne({ where: { id } });
  }

  async deleteProduct(id: number): Promise<void> {
    await this.productRepository.delete(id);
  }
}
