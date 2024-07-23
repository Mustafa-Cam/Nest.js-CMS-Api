import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { HttpExceptionFilter } from './logger/exception-filter';
import { LogModule } from './logger/logger.module';
import { LanguageModule } from './modules/language/language.module';
import { staticLangModule } from './modules/staticlang/staticlang.module';
import { AuthGuard } from './middlewares/authenticate/auth.guard';
import { RolesModule } from './modules/roles/roles.module';
import { OptionsModule } from './modules/options/options.module';
import { MemberModule } from './modules/member/member.module';
import { MemberAddressModule } from './modules/memberaddress/memberaddress.module';
@Module({
  imports: [
    AuthModule, LogModule, LanguageModule, staticLangModule, 
    RolesModule,OptionsModule,MemberModule,MemberAddressModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule  {}

