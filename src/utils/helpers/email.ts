import { Injectable } from '@nestjs/common';
import { MailDataRequired, default as SendGrid } from '@sendgrid/mail';

@Injectable()
export class EmailService {
  constructor() {
    SendGrid.setApiKey(process.env.SENDGRID_API_KEY);
  }

  async sendForgotPasswordEmail(
    email: string,
    username: string,
    reset_link: string,
  ): Promise<void> {
    try {
      const mail: MailDataRequired = {
        to: email,
        from: process.env.SENDGRID_SENDER_EMAIL,
        templateId: process.env.SENDGRID_FORGOT_PASSWORD_TEMPLATE_ID,
        dynamicTemplateData: {
          username: username,
          password_reset_link: reset_link,
        },
      };
      await SendGrid.send(mail);
    } catch (error) {
      throw error;
    }
  }

  async sendOtpEmail(email: string, otp: number) {
    try {
      const mail: MailDataRequired = {
        to: email,
        from: process.env.SENDGRID_SENDER_EMAIL,
        subject: 'OTP',
        html: `${otp}`,
      };
      await SendGrid.send(mail);
    } catch (error) {
      throw error;
    }
  }
}
