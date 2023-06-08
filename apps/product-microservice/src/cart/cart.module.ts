import { Module } from '@nestjs/common';
import { HttpRequestModule } from '../../../../shared/http-requests/http-request.module';
import { HttpModule } from '@nestjs/axios';
import { CartController } from './controllers/cart.controller';
import { CartService } from './services/cart.service';
import { CartRepository } from './repositories/cart.respository';
import { ProductInCartRepository } from './repositories/productInCart.respository';
import { ProductRepository } from '../product/repositories/product.repository';
import { GHNModule } from '../delivery/delivery.module';
import { DeliveryService } from '../delivery/services/delivery.service';

@Module({
  imports: [HttpRequestModule, HttpModule, GHNModule],
  providers: [
    CartService,
    CartRepository,
    ProductInCartRepository,
    ProductRepository,
    DeliveryService,
  ],
  controllers: [CartController],
})
export class CartModule {}
