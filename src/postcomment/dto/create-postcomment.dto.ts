import { ApiProperty } from '@nestjs/swagger';

export class CreatePostcommentDto {
  @ApiProperty({
    type: String,
    example: 'Blog Comment',
    description: 'This is a required property',
  })
  readonly content: string;
  @ApiProperty({
    type: String,
    example: '1',
    description: 'This is a required property',
  })
  readonly post_id: string;
}
