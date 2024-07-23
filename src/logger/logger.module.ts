import {  Module } from '@nestjs/common';
import { DatabaseModule } from 'src/providers/database/database.module';
import { logModelProviders } from './schemas/log.provider';
import { LogService } from './logger.service';
import { HttpExceptionFilter } from './exception-filter';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [...logModelProviders,LogService, HttpExceptionFilter],//
  exports: [LogService], // Diger moduller tarafindan cagirilabilir.
})
export class LogModule {}
