import { Global, Module } from '@nestjs/common';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AppLogger } from './logger/app.logger';
import { LOGGER_CONTEXT } from './constants';

@Global()
@Module({
  providers: [
    {
      provide: AppLogger,
      useFactory: () => new AppLogger(LOGGER_CONTEXT),
    },
    JwtStrategy,
  ],
  exports: [AppLogger, JwtStrategy],
})
export class CommonModule {}
