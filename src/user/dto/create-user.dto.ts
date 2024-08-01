import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    type: String,
    example: 'Kamran',
    description: 'This is a required property',
  })
  readonly name: string;
  @ApiProperty({
    type: String,
    example: 'rana.kamran@invozone.dev',
    description: 'This is a required property',
  })
  readonly email: string;
  @ApiProperty({
    type: String,
    example: 'zxcvbnm',
    description: 'This is a required property',
  })
  readonly password: string;
}
