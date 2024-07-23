import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Username of the user. It should be unique.',
    example: 'admin',
  })
  username: string;
  @ApiProperty({ description: 'Password of the user.', example: 'merhabalar' })
  password: string;
}
