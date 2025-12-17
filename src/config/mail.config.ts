import 'dotenv/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailerOptions } from '@nestjs-modules/mailer';
import * as path from 'path';
import { IMailOptions } from '@common/types';
import { parseInt } from '@common/utils';

export const mailConfig = (options?: IMailOptions): MailerOptions => {
  console.log('aa', {
    host: options?.host ?? process.env.SMTP_HOST ?? 'localhost',
    port: parseInt(options?.port ?? process.env?.SMTP_PORT) ?? 587,
    secure: options?.port === 465, // true for 465, false for 587/other
    requireTLS: true, // Force STARTTLS for port 587
    // pool: true, // Enable connection pooling
    maxConnections: 5, // Limit simultaneous connections
    maxMessages: 100, // Max emails per connection

    // ✅ REQUIRED FOR RENDER
    connectionTimeout: 60000,
    greetingTimeout: 60000,
    socketTimeout: 60000,

    tls: {
      rejectUnauthorized: false, // Help with self-signed certs or proxy issues
    },

    auth: {
      user: options?.user ?? process.env.SMTP_USER ?? 'user',
      pass: options?.password ?? process.env.SMTP_PASSWORD ?? 'password',
    },

    logger: true, // Log to console
    debug: true, // Include SMTP traffic in logs
  });

  const mailConfiguration: MailerOptions = {
    transport: {
      host: options?.host ?? process.env.SMTP_HOST ?? 'localhost',
      port: parseInt(options?.port ?? process.env?.SMTP_PORT) ?? 587,
      secure: options?.port === 465, // true for 465, false for 587/other
      requireTLS: true, // Force STARTTLS for port 587
      // pool: true, // Enable connection pooling
      maxConnections: 5, // Limit simultaneous connections
      maxMessages: 100, // Max emails per connection

      // ✅ REQUIRED FOR RENDER
      connectionTimeout: 60_000,
      greetingTimeout: 60_000,
      socketTimeout: 60_000,

      tls: {
        rejectUnauthorized: false, // Help with self-signed certs or proxy issues
      },

      auth: {
        user: options?.user ?? process.env.SMTP_USER ?? 'user',
        pass: options?.password ?? process.env.SMTP_PASSWORD ?? 'password',
      },

      logger: true, // Log to console
      debug: true, // Include SMTP traffic in logs
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
