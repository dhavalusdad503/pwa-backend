import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { TEMPLATE_NAME } from '@/common/constants';
import { AppLogger } from '@/common/logger/app.logger';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly logger: AppLogger,
  ) {}

  async sendForgotPasswordMail(to: string, name: string, redirectUrl: string) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Reset Your Password',
        template: TEMPLATE_NAME.FORGOT_PASSWORD,
        context: {
          name,
          redirect_url: redirectUrl,
        },
      });
      this.logger.log('✉️ Forgot Password Mail Sent Successfully');
      return 'Email Sent Successful';
    } catch (error) {
      this.logger.error('❌ Forgot Password Send mail error', error);
      throw new ServiceUnavailableException('Email service unavailable');
    }
  }
}
