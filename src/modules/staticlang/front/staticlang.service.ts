import { Injectable } from '@nestjs/common';

@Injectable()
export class FrontStaticLangService {
  getHello(): string {
    return 'Hello World!';
  }
}
