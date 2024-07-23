import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty,IsArray,IsOptional } from 'class-validator';

export class staticLangDto {
  @IsString()
  @IsOptional() //! boş olamaz. Burayı değiştirim
  @ApiProperty({
    description:'',
    example: 'Home Page',
  })
  name: string;

  
  // @IsArray()
  // @IsString({ each: true })
  @IsOptional()
  @ApiProperty({
    description:'',
    example: '[{"lang": "Tr", "value": "Ana Sayfa"}]'
  })
  value: string[];

  createdDate:Date;
}
