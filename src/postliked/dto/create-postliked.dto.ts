import { ApiProperty } from '@nestjs/swagger';

export class CreatePostlikedDto {
  @ApiProperty({
    type: String,
    example: '1',
    description: 'This is a required property',
  })
  readonly post_id: string;
}
