import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsNotEmpty,
  IsString,
  IsEmail,
  IsBoolean,
} from 'class-validator';

export class userDto {
//   @IsNumber()
//   @IsNotEmpty()
//   @ApiProperty()
//   userId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({example: 'admin'})
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({example: 'merhaba'})
  password: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({example: 'Boss Admin'})
  fullname: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({example:"admin@example.com"})
  email: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({example: 1})
  role: number;

  // @IsNumber()
  // @IsNotEmpty()
  // @ApiProperty({example: 1})
  // active: number;

  // @IsBoolean()
  // @IsNotEmpty()
  @ApiProperty({example: false})
  deletedAt: boolean;

  createdDate: Date;
}
