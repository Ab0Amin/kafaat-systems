import { Injectable } from '@nestjs/common';
import * as postmark from 'postmark';

@Injectable()
export class EmailService {
  private client: postmark.ServerClient;

  constructor() {
    if (!process.env.POSTMARK_TOKEN) {
      throw new Error('POSTMARK_TOKEN environment variable is not set');
    }
    this.client = new postmark.ServerClient(process.env.POSTMARK_TOKEN);
  }

  async sendSetPasswordEmail(to: string, url: string, expiryDate: string) {
    await this.client.sendEmailWithTemplate({
      From: process.env.SEND_EMAIL?.toString() || '',
      To: to,
      TemplateId: Number(process.env.POSTMARK_SET_PASSWORD_TEMPLATE_ID),
      TemplateModel: {
        name: url,
        product_name: 'data.productName',
        action_url: 'data.actionUrl',
        operating_system: 'data.operatingSystem',
        browser_name: 'data.browserName',
        support_url: 'ahmed.com.support',
        expiry_date: expiryDate,
      },
    });
  }
}
