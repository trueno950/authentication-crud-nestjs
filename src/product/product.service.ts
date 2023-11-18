import { HttpStatus, Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import { CreateProductDto } from './dto/index';
import { throwException } from '../common/thrwoException.helper';
import { Product } from './product.entity';
import { EditProductDto } from './dto/editProduct.dto';
import { PaginateQuery, Paginated } from 'nestjs-paginate';
import { Status } from './enums/status.enum';
import { BrandRepository } from '../brand/brand.repository';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly brandRepository: BrandRepository,
  ) {}

  async listProducts(query: PaginateQuery): Promise<Paginated<Product>> {
    return await this.productRepository.findAll(query);
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const existBrand = await this.brandRepository.findById(
      createProductDto.brandId,
    );

    !existBrand && throwException(HttpStatus.NOT_FOUND, 'Not found brand');

    const existProduct = await this.productRepository.existProduct(
      createProductDto.barcode,
      createProductDto.brandId,
    );

    existProduct && throwException(HttpStatus.CONFLICT, 'Duplicate product');

    const newProduct = new Product();
    newProduct.brand = existBrand;
    Object.assign(newProduct, createProductDto);
    return await this.productRepository.createProduct(newProduct);
  }

  async editProduct(
    productId: number,
    editProductDto: EditProductDto,
  ): Promise<object> {
    if (!Number.isInteger(productId)) {
      throwException(HttpStatus.BAD_REQUEST, 'Id must be an integer');
    }
    const existProduct = await this.productRepository.findById(productId);

    !existProduct && throwException(HttpStatus.NOT_FOUND, 'Not found product');

    try {
      const newProduct = new Product();
      Object.assign(newProduct, editProductDto);
      return await this.productRepository.updateProduct(productId, newProduct);
    } catch (error) {
      if (error.code === '23503') {
        throwException(HttpStatus.NOT_FOUND, 'Id brand no exist');
      } else {
        throwException(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error');
      }
    }
  }

  async deleteProduct(productId: number): Promise<Product> {
    if (!Number.isInteger(productId)) {
      throwException(HttpStatus.BAD_REQUEST, 'Id must be an integer');
    }
    const product = await this.productRepository.findById(productId);

    !product && throwException(HttpStatus.NOT_FOUND, 'Not found product');

    product.status = Status.DELETED;
    return await this.productRepository.updateProduct(productId, product);
  }
}
