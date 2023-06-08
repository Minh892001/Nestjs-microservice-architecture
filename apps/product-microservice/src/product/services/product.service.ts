import { Injectable, BadRequestException } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { plainToInstance } from 'class-transformer';
import { ProductOutput } from '../dtos/product-output.dto';
import { ProductIntput } from '../dtos/product-input.dto';
import { ulid } from 'ulid';
import { Product } from '../entities/product.entity';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getProducts(search) {
    const products = await this.productRepository.getProducts(search);
    return products;
  }

  async getProduct(productId: string) {
    const product = await this.productRepository.findOneBy({
      productId: productId,
    });
    if (!product) throw new BadRequestException('Not found product');
    return plainToInstance(ProductOutput, product);
  }

  async createProduct(productInput: ProductIntput) {
    const product = await this.productRepository.findOne({
      where: { productName: productInput.productName },
    });

    if (product) throw new BadRequestException('Product is exist');

    const productId = ulid();
    const newProduct = plainToInstance(Product, { productId, ...productInput });

    const productOuput = await this.productRepository.save(newProduct);

    return plainToInstance(ProductOutput, productOuput);
  }

  async updateProduct(productId: string, productInput: ProductIntput) {
    const product = await this.productRepository.findOneBy({
      productId: productId,
    });
    if (!product) throw new BadRequestException('Not found product');

    return await this.productRepository.update(
      { productId: productId },
      {
        productName: productInput.productName,
        type: productInput.type,
        price: productInput.price,
        description: productInput.description,
        photoUrl: productInput.photoUrl,
        quantity: productInput.quantity,
      },
    );
  }

  async deleteProduct(productId: string) {
    const deletedProduct = await this.productRepository.findOne({
      where: { productId },
    });
    return await this.productRepository.softRemove(deletedProduct);
  }
}
