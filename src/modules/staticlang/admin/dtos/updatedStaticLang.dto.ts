import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray
} from 'class-validator';

export class UpdateStaticLangRequestDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description:'',
    example: 'Home Page',
  })
  name?: string;

  @IsArray()
  // @IsString({ each: true })
  @IsOptional()
  @ApiProperty({
    description:'',
    example: '[{"lang": "Tr", "value": "Ana Sayfa"}]',
  })
  value: string[];
}
