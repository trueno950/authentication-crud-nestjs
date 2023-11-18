import { IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../enums/status.enum';

export class EditBrandDto {
  @ApiProperty({ example: 'NewBrandName', description: 'The new name of the brand (optional)' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'Active',
    description: 'The new status of the brand (optional)',
    required: false,
  })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;
}
