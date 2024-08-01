import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({
    type: String,
    example: 'Tech Trends',
    description: 'This is a required property',
  })
  name: string;
  @ApiProperty({
    type: String,
    example: 'Analysis of emerging tech trends and innovations.',
    description: 'This is a required property',
  })
  description: string;
}
