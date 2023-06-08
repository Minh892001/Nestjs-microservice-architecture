import { Body, Controller, Post } from '@nestjs/common';
import { SmsService } from '../services/sms.service';

@Controller('sms')
export class SmsController {
  constructor(private smsService: SmsService) {}

  @Post()
  async send(@Body() messagedto: { to: string; message: string }) {
    return this.smsService.sendMessage(messagedto.to, messagedto.message);
  }
}
