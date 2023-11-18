import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsInt,
  IsEnum,
  IsOptional,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../enums/status.enum';

export class CreateProductDto {
  @ApiProperty({ example: 'Product Name', description: 'The name of the product' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Product Description', description: 'The description of the product' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 19.99, description: 'The selling price of the product' })
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  @Min(0.01)
  @Max(999999999.99)
  sellingPrice: number;

  @ApiProperty({ example: 15.99, description: 'The purchase price of the product' })
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  @Min(0.01)
  @Max(999999999.99)
  purchasePrice: number;

  @ApiProperty({ example: 100, description: 'The stock quantity of the product' })
  @IsNotEmpty()
  @IsInt()
  stockQuantity: number;

  @ApiProperty({ example: 'FIFO', description: 'The costing method of the product' })
  @IsNotEmpty()
  @IsString()
  costingMethod: string;

  @ApiProperty({ example: '123456789', description: 'The barcode of the product' })
  @IsNotEmpty()
  @IsString()
  barcode: string;

  @ApiProperty({ example: 1, description: 'The ID of the brand associated with the product' })
  @IsNotEmpty()
  brandId: number;

  @ApiProperty({
    example: 'Active',
    description: 'The status of the product (optional)',
    required: false,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
