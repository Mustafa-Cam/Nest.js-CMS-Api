import { Injectable } from '@nestjs/common';

@Injectable()
export class FrontLanguageService {
  getHello(): string {
    return 'Hello World!';
  }
}
