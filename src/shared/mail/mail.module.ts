import { IMailOptions } from '@/common/types';
import { mailConfig } from '@/config/mail.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from './mail.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const opts = config.get<IMailOptions>('mail');
        return {
          ...mailConfig(opts),
        };
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
