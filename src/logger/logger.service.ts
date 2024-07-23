import { Inject, Injectable, LoggerService, Scope } from '@nestjs/common';
import { Model } from 'mongoose';
import { Log } from './schemas/log.schema';

@Injectable({ scope: Scope.TRANSIENT })
export class LogService implements LoggerService {
  constructor(@Inject('LOG_MODEL') private readonly logModel: Model<Log>) {
    // TODO set global mode for change
    const globalMode = true;

    if (globalMode) {
      // TODO
    }
  }
  
  async log(
    message: any,
    data: { action: string; details?: string,  role?: any, userId?: any; createdDate: Date; },
  ) {
    const currentTime = new Date(); 
    console.log(message, data);
    await this.logModel.create({
      message,
      ...data,
      // type: 'log',
    });
  }
  async fatal(
    message: any,
    data: { action: string; details?: string,  role?: number, userId?: any;  },
  ) {
    console.error(message, data);
    await this.logModel.create({
      message,
      ...data,
      type: 'fatal',
    });
  }
  async error(
    message: any,
    data: { action: string; details?: string,  role?: number, userId?: any; createdDate: Date; },
  ) {
    console.error(message, data);
    await this.logModel.create({
      message,
      ...data,
      type: 'error',
    });
  }
  async warn(
    message: any,
    data: { action: string; details?: string,  role?: number, userId?: any;  },
  ) {
    console.warn(message, data);
    await this.logModel.create({
      message,
      ...data,
      type: 'warn',
    });
  }

  async debug?(
    message: any,
    data: { action: string; details?: string,  role?: number, userId?: any;  },
  ) {
    console.debug(message, data);
    await this.logModel.create({
      message,
      ...data,
      type: 'debug',
    });
  }

  async verbose?(
    message: any,
    data: { action: string; details?: string,  role?: number, userId?: any;  },
  ) {
    console.debug(message, data);
    await this.logModel.create({
      message,
      ...data,
      type: 'verbose',
    });
  }
}
