import { ApiProperty } from '@nestjs/swagger';

export class CreateBlogpostDto {
  @ApiProperty({
    type: String,
    example: 'Blog Title',
    description: 'This is a required property',
  })
  readonly title: string;
  @ApiProperty({
    type: String,
    example: 'Blog Description',
    description: 'This is a required property',
  })
  readonly content: string;
  @ApiProperty({
    type: Number,
    example: 1,
    description: 'This is a required property',
  })
  readonly categoryId: number;
}
