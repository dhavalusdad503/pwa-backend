import 'dotenv/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerOptions } from '@nestjs-modules/mailer';
import * as path from 'path';
import { IMailOptions } from '@common/types';
import { parseInt } from '@common/utils';

export const mailConfig = (options?: IMailOptions): MailerOptions => {
  const mailConfiguration: MailerOptions = {
    transport: {
      host: options?.host ?? process.env.SMTP_HOST ?? 'localhost',
      port: parseInt(options?.port ?? process.env?.SMTP_PORT) ?? 587,
      secure: false,
      // requireTLS: true,
      // pool: true, // Enable connection pooling
      maxConnections: 5, // Limit simultaneous connections
      maxMessages: 100, // Max emails per connection

      // ✅ REQUIRED FOR RENDER
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 10_000,

      tls: {
        rejectUnauthorized: false,
      },

      auth: {
        user: options?.user ?? process.env.SMTP_USER ?? 'user',
        pass: options?.password ?? process.env.SMTP_PASSWORD ?? 'password',
      },
    },
    defaults: {
      from: {
        name: 'No Reply',
        address: options?.from ?? process.env.SMTP_FROM ?? 'abc@example.com',
      },
    },
    template: {
      dir: path.join(__dirname, '/../shared/mail/templates'),
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  };

  return mailConfiguration;
};
