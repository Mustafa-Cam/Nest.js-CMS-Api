import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsBoolean } from 'class-validator';
import { ObjectId } from 'mongoose';

export class rolesDto {

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description:"roleId",
    example: '35',
  })
  roleId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description:"title",
    example: 'admin',
  })
  title: string;


  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description:"",
    example: 'management',
  })
  action: string;

  createdDate: Date;
}
