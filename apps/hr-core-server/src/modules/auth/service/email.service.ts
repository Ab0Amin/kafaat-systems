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

  async sendSetPasswordEmail({
    to,
    ClientName,
    expiryDate,
    url,
    operating_system,
    browser_name,
    button_text,
    support_url,
    product_name,
  }: {
    to: string;
    ClientName: string;
    expiryDate: string;
    url: string;
    operating_system: string;
    browser_name: string;
    button_text: 'Set Password';
    support_url: 'support.kbs.sa';
    product_name: 'KAFAAT SYSTEMS';
  }) {
    await this.client.sendEmailWithTemplate({
      From: process.env.SEND_EMAIL?.toString() || '',
      To: to,
      MessageStream: process.env.POSTMARK_MESSAGE_STREAM?.toString(),
      TemplateId: Number(process.env.POSTMARK_SET_PASSWORD_TEMPLATE_ID),
      TemplateModel: {
        name: ClientName,
        product_name: product_name,
        action_url: url,
        operating_system: operating_system,
        browser_name: browser_name,
        support_url: support_url,
        expiry_date: expiryDate,
        btn_txt: button_text,
      },
    });
  }
}
