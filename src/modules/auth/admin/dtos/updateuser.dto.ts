import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsNotEmpty,
  IsString,
  IsEmail,
  IsBoolean,
  IsOptional
} from 'class-validator';

export class updateUserDto {

  @IsString()
  @IsOptional()
  @ApiProperty({example: 'admin'})
  
  username: string;

  @IsString()
  @IsOptional()
  @ApiProperty({example: 'merhaba'})
  password: string;

  @IsString()
  @IsOptional()
  @ApiProperty({example: 'Boss Admin'})
  fullname: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({example:"admin@example.com"})
  email: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({example: 1})
  role: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({example: 1})
  active: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({example: false})
  deletedAt: boolean;

  createdDate: Date;
}
