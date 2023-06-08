import { Injectable } from '@nestjs/common';
import { TwilioService as tf } from 'nestjs-twilio';

@Injectable()
export class SmsService {
  constructor(private smsService: tf) {}

  async sendMessage(to: string, message: string) {
    const result = await this.smsService.client.messages.create({
      to: to,
      from: '+15855232553',
      body: message,
    });
    return { message: 'Message sent successfully', sid: result.sid };
  }
}
