import { Global, Module } from '@nestjs/common';
import { LOGGER_CONTEXT } from '@common/constants';
import { AppLogger } from './app.logger';

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
