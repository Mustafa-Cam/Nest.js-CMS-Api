import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { isEmpty } from 'rxjs';

export class UpdateLanguageRequestDto {
  @IsString()
  @IsOptional()
  @ApiProperty({
    description:
      'lang genellikle dilin kodunu saklamak ve kod üzerinden işlemler yapmak için kullanılır',
    example: 'En',
  })
  lang?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    description:
      'language genellikle kullanıcı arayüzünde veya raporlamada gösterilmek üzere daha açıklayıcı bir formda dilin tam adını saklamak için kullanılır.',
    example: 'English',
  })
  language: string;
  
  @IsNumber()
  @IsOptional()
  @ApiProperty({ description: '', example: 1 })
  current: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ description: '', example: false })
  deletedAt: boolean;
}
