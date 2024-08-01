import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
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
