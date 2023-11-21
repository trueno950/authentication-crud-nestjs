import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { BrandService } from './brand.service';
import { CreateBrandDto, EditBrandDto, BrandStatusDto } from './dto';
import {
  ApiOkPaginatedResponse,
  ApiPaginationQuery,
  FilterOperator,
  Paginate,
  PaginateConfig,
  PaginateQuery,
  Paginated,
} from 'nestjs-paginate';

import { Brand } from './brand.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Status } from './enums/status.enum';

const BRAND_PAGINATION_CONFIG: PaginateConfig<any> = {
  defaultSortBy: [['name', 'DESC']],
  sortableColumns: ['name', 'barcode', 'createdAt', 'updatedAt'],
  filterableColumns: {
    name: [FilterOperator.EQ, FilterOperator.ILIKE], // Example of multiple filter operators for 'name'
    barcode: [FilterOperator.EQ],
    'brand.id': [FilterOperator.EQ],
    createdAt: [FilterOperator.BTW],
    updatedAt: [FilterOperator.BTW],
  },
};

@ApiTags('brands')
@Controller('brands')
export class BrandController {
  constructor(private brandService: BrandService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOkPaginatedResponse(Paginated<Brand>, BRAND_PAGINATION_CONFIG)
  @ApiPaginationQuery(BRAND_PAGINATION_CONFIG)
  @ApiOperation({ summary: 'List all brands' })
  @ApiResponse({
    status: HttpStatus.PARTIAL_CONTENT,
    description: 'List of brands',
    type: Paginated<Brand>,
  })
  async listBrands(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<Brand>> {
    return this.brandService.listBrands(query);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new brand' })
  @ApiBody({ type: CreateBrandDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Brand created',
    type: Brand,
  })
  @Post()
  async createBrand(
    @Body() newBrand: CreateBrandDto,
    @Res() res,
  ): Promise<void> {
    const brand = await this.brandService.createBrand(newBrand);
    res
      .status(HttpStatus.CREATED)
      .json({ message: 'Brand created', brand, code: HttpStatus.CREATED });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':brandId')
  @ApiOperation({ summary: 'Edit a brand by ID' })
  @ApiParam({ name: 'brandId', description: 'ID of the brand' })
  @ApiBody({ type: EditBrandDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Brand updated successfully',
  })
  @Patch(':brandId')
  async editBrand(
    @Param() param: { brandId: string },
    @Body() brand: EditBrandDto,
    @Res() res,
  ): Promise<void> {
    await this.brandService.editBrand(parseInt(param.brandId), brand);
    res.status(HttpStatus.OK).json({ message: 'Brand updated successful' });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':brandId')
  @ApiOperation({ summary: 'Delete a brand by ID' })
  @ApiParam({ name: 'brandId', description: 'ID of the brand' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Brand deleted successfully',
  })
  @Delete(':brandId')
  async deleteBrand(
    @Param() param: { brandId: string },
    @Res() res,
  ): Promise<void> {
    await this.brandService.deleteBrand(parseInt(param.brandId));
    res.status(HttpStatus.OK).json({ message: 'Brand updated successful' });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':brandId/activate')
  @ApiOperation({ summary: 'Activate or Deactivate a brand by ID' })
  @ApiParam({ name: 'brandId', description: 'ID of the brand' })
  @ApiBody({ type: BrandStatusDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Brand activation status updated successfully',
  })
  @Patch(':brandId/activate')
  async activateDeactivateBrand(
    @Param() param: { brandId: string },
    @Body() body: BrandStatusDto,
    @Res() res,
  ): Promise<void> {
    const { brandId } = param;
    const { isActive } = body;

    await this.brandService.editBrand(parseInt(brandId), {status: isActive ? Status.ACTIVE : Status.INACTIVE});

    res.status(HttpStatus.OK).json({
      message: `Brand ${isActive ? 'activated' : 'deactivated'} successfully`,
    });
  }
}
