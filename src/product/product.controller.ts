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
import { ProductService } from './product.service';
import { CreateProductDto, EditProductDto } from './dto';
import { ApiOkPaginatedResponse, ApiPaginationQuery, FilterOperator, Paginate, PaginateConfig, PaginateQuery, Paginated } from 'nestjs-paginate';

import { Product } from './product.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

const PRODUCT_PAGINATION_CONFIG: PaginateConfig<any> = {
  defaultSortBy: [['name', 'DESC']],
  sortableColumns: ['id', 'name', 'barcode', 'brand', 'createdAt', 'updatedAt'],
  filterableColumns: {
    name: [FilterOperator.EQ, FilterOperator.ILIKE],
    barcode: [FilterOperator.EQ],
    'brand.id': [FilterOperator.EQ],
    createdAt: [FilterOperator.BTW],
    updatedAt: [FilterOperator.BTW],
  },
};

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOkPaginatedResponse(Paginated<Product>, PRODUCT_PAGINATION_CONFIG)
  @ApiPaginationQuery(PRODUCT_PAGINATION_CONFIG)
  @ApiOperation({ summary: 'List all products' })
  @ApiResponse({
    status: 200,
    description: 'List of products',
    type: Paginated<Product>,
  })
  async listProducts(
    @Paginate() query: PaginateQuery,
  ): Promise<Paginated<Product>> {
    return this.productService.listProducts(query);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Product created',
    type: Product,
  })
  async createProduct(
    @Body() newProduct: CreateProductDto,
    @Res() res,
  ): Promise<void> {
    const product = await this.productService.createProduct(newProduct);
    res
      .status(HttpStatus.CREATED)
      .json({ message: 'Product created', product, code: HttpStatus.CREATED });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':productId')
  @ApiOperation({ summary: 'Edit a product by ID' })
  @ApiParam({ name: 'productId', description: 'ID of the product' })
  @ApiBody({ type: EditProductDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product updated successfully',
  })
  async editProduct(
    @Param() param: { productId: string },
    @Body() product: EditProductDto,
    @Res() res,
  ): Promise<void> {
    await this.productService.editProduct(parseInt(param.productId), product);
    res.status(HttpStatus.OK).json({ message: 'Product updated successful' });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':productId')
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiParam({ name: 'productId', description: 'ID of the product' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product deleted successfully',
  })
  async deleteProduct(
    @Param() param: { productId: string },
    @Res() res,
  ): Promise<void> {
    await this.productService.deleteProduct(parseInt(param.productId));
    res.status(HttpStatus.OK).json({ message: 'Product updated successful' });
  }
}
