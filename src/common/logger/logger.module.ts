import { Global, Module } from '@nestjs/common';
import { AppLogger } from './app.logger';
import { LOGGER_CONTEXT } from '../constants';

@Global()
@Module({
  providers: [
    {
      provide: AppLogger,
      useFactory: () => new AppLogger(LOGGER_CONTEXT),
    },
  ],
  exports: [AppLogger],
})
export class LoggerModule {}
