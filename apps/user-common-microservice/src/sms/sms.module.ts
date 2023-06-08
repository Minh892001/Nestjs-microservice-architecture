import { SmsService } from './services/sms.service';
import { Module } from '@nestjs/common';
import { SmsController } from './controllers/sms.controller';
import { TwilioModule as tf } from 'nestjs-twilio';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    tf.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        accountSid: configService.get<string>('sms.accountId'),
        authToken: configService.get<string>('sms.authToken'),
      }),
    }),
  ],
  controllers: [SmsController],
  providers: [SmsService],
})
export class SmsModule {}
