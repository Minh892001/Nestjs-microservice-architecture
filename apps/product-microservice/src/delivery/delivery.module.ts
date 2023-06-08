import { Module } from '@nestjs/common';
import { DeliveryService } from './services/delivery.service';
import { DeliveryController } from './controllers/delivery.controller';
import { HttpRequestModule } from '../../../../shared/http-requests/http-request.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpRequestModule, HttpModule],
  providers: [DeliveryService],
  controllers: [DeliveryController],
})
export class GHNModule {}
