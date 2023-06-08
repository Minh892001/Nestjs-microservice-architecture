import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Query,
  Patch,
} from '@nestjs/common';
import { BaseMicroserviceResponse } from '../../../../../shared/dtos/base-microservice-response.dto';
import { ProductService } from '../services/product.service';
import { Product } from '../entities/product.entity';
import { ProductOutput } from '../dtos/product-output.dto';
import { ProductIntput } from '../dtos/product-input.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getProducts(
    @Query('search') search: string,
  ): Promise<BaseMicroserviceResponse<Product[]>> {
    const products = await this.productService.getProducts(search);
    return products;
  }

  @Get('/:productId')
  async getProduct(
    @Param('productId') productId: string,
  ): Promise<ProductOutput> {
    return await this.productService.getProduct(productId);
  }

  @Post()
  async createProduct(
    @Body() productInput: ProductIntput,
  ): Promise<ProductOutput> {
    return await this.productService.createProduct(productInput);
  }

  @Patch()
  async updateProduct(
    @Query('productId') productId: string,
    @Body() productInput: ProductIntput,
  ) {
    return await this.productService.updateProduct(productId, productInput);
  }

  @Delete('/:id')
  async deleteProduct(@Param('productId') productId: string): Promise<any> {
    return await this.productService.deleteProduct(productId);
  }
}
