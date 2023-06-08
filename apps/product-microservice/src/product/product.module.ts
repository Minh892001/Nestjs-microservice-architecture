import { Module } from '@nestjs/common';
import { ProductService } from './services/product.service';
import { ProductController } from './controllers/product.controller';
import { ProductRepository } from './repositories/product.repository';
import { HttpRequestModule } from '../../../../shared/http-requests/http-request.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpRequestModule, HttpModule],
  providers: [ProductService, ProductRepository],
  controllers: [ProductController],
})
export class ProductModule {}
