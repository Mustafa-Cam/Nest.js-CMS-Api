import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsBoolean,IsOptional } from 'class-validator';

export class LanguageDto {
  @IsString()
  @IsNotEmpty() //! boş olamaz.
  @ApiProperty({
    description:
      'lang genellikle dilin kodunu saklamak ve kod üzerinden işlemler yapmak için kullanılırken',
    example: 'tr',
  })
  lang: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'language genellikle kullanıcı arayüzünde veya raporlamada gösterilmek üzere daha açıklayıcı bir formda dilin tam adını saklamak için kullanılır.',
    example: 'Turkish',
  })
  language: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ description: '', example: 0 })
  current: number;


  @IsBoolean()
  @IsOptional()
  @ApiProperty({ description: '', example: false })
  deletedAt: boolean; 

  createdDate: Date;
}
