import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail,Length, IsBoolean,IsOptional, IsNumber } from 'class-validator';
import { memberAddressDto } from 'src/modules/memberaddress/admin/dtos/memberAddress.dto';

export class creatememberDto {
  @IsString()
  @IsNotEmpty() 
  @ApiProperty({
    description: 'name',
    example: 'Deniz',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'name',
    example: 'Yıldırım',
  })
  surname: string;
 
  
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({example: 'deniz@gmail.com', description: 'mail'})
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(10,10)
  @ApiProperty({example: '5448933211', description: 'phone'})
  phone: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({example: 'password:D', description: 'password'})
  password: string;

  @IsString()
  @IsOptional()
  @ApiProperty({example: '', description: 'token'})
  token: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({example: '0', description: 'isactive'})
  active: number;

  // @ApiProperty({example: '', description: 'date'})
  lastLogin: Date;

  createdDate: Date;
}