import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BrandStatusDto {
  @ApiProperty({ description: 'Activation status', example: true })
  @IsBoolean()
  isActive: boolean;
}
