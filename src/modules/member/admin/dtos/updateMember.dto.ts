import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail,Length, IsBoolean,IsOptional, IsNumber } from 'class-validator';

export class updateMemberDto {
  @IsString()
  @IsOptional() 
  @ApiProperty({
    description: 'name',
    example: 'Deniz',
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description: 'name',
    example: 'Yıldırım',
  })
  surname: string;

  
  @IsString()
  @IsOptional()
  @IsEmail()
  @ApiProperty({example: 'deniz@gmail.com', description: 'mail'})
  email: string;

  @IsString()
  @IsOptional()
  @Length(10,10)
  @ApiProperty({example: '5448933211', description: 'phone'})
  phone: string;

  @IsString()
  @IsOptional()
  @ApiProperty({example: 'password:D', description: 'password'})
  password: string;

  @IsString()
  @IsOptional()
  @ApiProperty({example: '', description: 'token'})
  token: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({example: '0', description: 'isactive'})
  active: number;

  lastLogin: Date;

  createdDate: Date;
}