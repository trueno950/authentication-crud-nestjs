import { HttpStatus, Injectable } from '@nestjs/common';
import { BrandRepository } from './brand.repository';
import { CreateBrandDto } from './dto/index';
import { throwException } from '../common/thrwoException.helper';
import { Brand } from './brand.entity';
import { EditBrandDto } from './dto/editBrand.dto';
import { PaginateQuery, Paginated } from 'nestjs-paginate';
import { Status } from './enums/status.enum';

@Injectable()
export class BrandService {
  constructor(private readonly brandRepository: BrandRepository) {}

  async listBrands(query: PaginateQuery): Promise<Paginated<Brand>> {
    console.log('query',query)
    return await this.brandRepository.findAll(query);
  }

  async createBrand(createBrandDto: CreateBrandDto): Promise<Brand> {
    const existBrand = await this.brandRepository.existBrand(
      createBrandDto.name,
    );

    existBrand && throwException(HttpStatus.CONFLICT, 'Duplicate brand');

    const newBrand = new Brand();
    Object.assign(newBrand, createBrandDto);
    return await this.brandRepository.createBrand(newBrand);
  }

  async editBrand(
    brandId: number,
    editBrandDto: EditBrandDto,
  ): Promise<object> {
    if (!Number.isInteger(brandId)) {
      throwException(HttpStatus.BAD_REQUEST, 'Id must be an integer');
    }
    const existBrand = await this.brandRepository.findById(brandId);

    !existBrand && throwException(HttpStatus.NOT_FOUND, 'Not found brand');

    try {
      const newBrand = new Brand();
      Object.assign(newBrand, editBrandDto);
      return await this.brandRepository.updateBrand(brandId, newBrand);
    } catch (error) {
      if (error.code === '23503') {
        throwException(HttpStatus.NOT_FOUND, 'Id brand no exist');
      } else {
        throwException(HttpStatus.INTERNAL_SERVER_ERROR, 'Server error');
      }
    }
  }

  async deleteBrand(brandId: number): Promise<Brand> {
    if (!Number.isInteger(brandId)) {
      throwException(HttpStatus.BAD_REQUEST, 'Id must be an integer');
    }
    const brand = await this.brandRepository.findById(brandId);

    !brand && throwException(HttpStatus.NOT_FOUND, 'Not found brand');

    brand.status = Status.DELETED;
    return await this.brandRepository.updateBrand(brandId, brand);
  }
}
