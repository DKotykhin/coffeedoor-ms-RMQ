import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RpcException } from '@nestjs/microservices';
import * as sgMail from '@sendgrid/mail';

import { MailData } from './dto/mail-data.dto';

@Injectable()
export class MailSenderService {
  constructor(private readonly configService: ConfigService) {}
  protected readonly logger = new Logger(MailSenderService.name);
  async sendMail({
    to,
    subject,
    html,
  }: MailData): Promise<{ status: boolean; message: string }> {
    sgMail.setApiKey(this.configService.get('SG_API_KEY'));
    const msg = {
      to,
      from: `"CoffeeDoor" <${this.configService.get('SG_EMAIL_ADDRESS')}>`,
      subject,
      html,
    };
    try {
      await sgMail.send(msg);
      this.logger.log(`Email sent to ${to}`);
      return { status: true, message: `Email to ${to} successfully sent` };
    } catch (error) {
      this.logger.error(
        `Error: code ${error.error?.status || 500} - ${error.message}`,
      );
      throw new RpcException({
        status: error.error?.status || 500,
        message: error.message,
      });
    }
  }
}
