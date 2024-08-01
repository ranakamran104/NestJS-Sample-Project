import { ApiProperty } from '@nestjs/swagger';

export class Category {
  @ApiProperty({ example: 'Category 1', description: 'The age of the Cat' })
  name: string;

  @ApiProperty({ example: 'Description 1', description: 'The age of the Cat' })
  description: string;
}
