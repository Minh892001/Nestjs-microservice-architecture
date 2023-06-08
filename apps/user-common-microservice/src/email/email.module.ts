import { Module } from '@nestjs/common';
import { EmailController } from './controllers/email.controller';

@Module({
  controllers: [EmailController],
})
export class EmailModule {}
