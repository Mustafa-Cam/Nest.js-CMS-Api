import { Controller, Get } from '@nestjs/common';
import { FrontStaticLangService } from './staticlang.service';

@Controller('staticlang')
export class FrontStaticLangController {
  constructor(private readonly languageService: FrontStaticLangService) {}
}
