import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiPropertyOptional({
    type: String,
    example: 'Tech Trends',
    description: 'This is an optional property',
  })
  name?: string;

  @ApiPropertyOptional({
    type: String,
    example: 'Analysis of emerging tech trends and innovations.',
    description: 'This is an optional property',
  })
  description?: string;
}
