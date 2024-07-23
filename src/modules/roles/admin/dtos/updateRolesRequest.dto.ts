import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { isEmpty } from 'rxjs';

export class UpdateRolesRequestDto {
  

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
    example: 'example'
  })
  action: string;

  createdDate: Date;

}
