import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsBoolean,IsOptional } from 'class-validator';

export class optionsDto {
  // @IsString()
  @IsNotEmpty() 
  @ApiProperty({
    description: 'Tr',
    example: 'Tr',
  })
  lang: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'name',
    example: 'base_url',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({example: 'http://localhost:3000', description: 'value'})
  value: string;

  createdDate: Date;
}
