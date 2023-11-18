import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Brand } from '../../brand/brand.entity';
import { Status } from '../enums/status.enum';

export class EditProductDto {
  @ApiProperty({ example: 'Updated Product Name', description: 'The new name of the product (optional)' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'Updated Product Description', description: 'The new description of the product (optional)' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 24.99, description: 'The new selling price of the product (optional)' })
  @IsOptional()
  @IsNumber()
  sellingPrice?: number;

  @ApiProperty({ example: 19.99, description: 'The new purchase price of the product (optional)' })
  @IsOptional()
  @IsNumber()
  purchasePrice?: number;

  @ApiProperty({ example: 150, description: 'The new stock quantity of the product (optional)' })
  @IsOptional()
  @IsNumber()
  stockQuantity?: number;

  @ApiProperty({ example: 'LIFO', description: 'The new costing method of the product (optional)' })
  @IsOptional()
  @IsString()
  costingMethod?: string;

  @ApiProperty({ example: '987654321', description: 'The new barcode of the product (optional)' })
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiProperty({ example: { id: 2, name: 'Updated Brand' }, description: 'The new brand of the product (optional)' })
  @IsOptional()
  brand?: Brand;

  @ApiProperty({
    example: 'Active',
    description: 'The new status of the product (optional)',
    required: false,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
