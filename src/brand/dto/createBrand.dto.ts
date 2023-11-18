import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../enums/status.enum';

export class CreateBrandDto {
  @ApiProperty({ example: 'MyBrand', description: 'The name of the brand' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Active',
    description: 'The status of the brand (optional)',
    required: false,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
