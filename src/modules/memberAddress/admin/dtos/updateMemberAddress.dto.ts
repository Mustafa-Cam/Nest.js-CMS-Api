
import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail,Length, IsBoolean,IsOptional, IsNumber } from 'class-validator';

export class updateMemberAddressDto {
  @IsNumber()
  @IsOptional() 
  @ApiProperty({
    description: '',
    example: 0,
  })
  default: number;

  @IsString()
  @IsOptional() 
  @ApiProperty({
    description: 'title',
    example: 'title',
  })
  title: string;

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
  @ApiProperty({example: '12345', description: 'idNo'})
  idNo: string;

  @IsString()
  @IsOptional()
  @ApiProperty({example: 'asd', description: 'tax'})
  tax: string;

  @IsString()
  @IsOptional()
  @ApiProperty({example: 'Istanbul', description: 'town'})
  town: string;

  @IsString()
  @IsOptional()
  @ApiProperty({example: 'gunes sk', description: 'address'})
  address: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({example: 0, description: '1'})
  type: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({example: 1, description: '1'})
  active: number;

  createdDate: Date;
}