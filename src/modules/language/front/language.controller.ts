import { Controller, Get } from '@nestjs/common';
import { FrontLanguageService } from './language.service';

@Controller('language')
export class FrontLanguageController {
  constructor(private readonly languageService: FrontLanguageService) {}

  
}
