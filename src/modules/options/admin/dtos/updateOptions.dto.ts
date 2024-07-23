import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { isEmpty } from 'rxjs';

export class UpdateOptionsDto {
  // @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Tr',
  })
  lang: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description:'',
    example: 'base_url',
  })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: '', example: 'http://localhost:3000' })
  value: string;

  createdDate: Date;
}
