import { Module } from '@nestjs/common';
import { CartService } from './services/cart.service';
import { CartController } from './controllers/cart.controller';
import { SharedModule } from '../../../../shared/share.module';
import { ConfigurationModule } from '../config/configuration.module';
import { HttpRequestModule } from '../../../../shared/http-requests/http-request.module';

@Module({
  imports: [SharedModule, ConfigurationModule, HttpRequestModule],
  providers: [CartService],
  controllers: [CartController],
})
export class CartModule {}
