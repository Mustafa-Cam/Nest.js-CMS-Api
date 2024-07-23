
import { Optional } from '@nestjs/common';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail,Length, IsBoolean,IsOptional, IsNumber } from 'class-validator';
import mongoose from 'mongoose';

export class memberAddressDto {

    @ApiHideProperty()
    memberId: mongoose.Schema.Types.ObjectId;

  // @IsNumber()
  // @IsNotEmpty() 
  // @ApiProperty({
  //   description: '',
  //   example: 0,
  // })
  // default: number;

  @IsString()
  @IsNotEmpty() 
  @ApiProperty({
    description: 'title',
    example: 'title',
  })
  title: string;

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
  @IsNotEmpty()
  @ApiProperty({example: 'gunes sk', description: 'address'})
  address: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({example: 0, description: '1'})
  type: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({example: 1, description: '1'})
  active: number;

  createdDate: Date;
}