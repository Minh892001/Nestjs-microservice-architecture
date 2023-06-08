import { Injectable, BadRequestException } from '@nestjs/common';
import { CartRepository } from '../repositories/cart.respository';
import { ProductInCartRepository } from '../repositories/productInCart.respository';
import { ProductRepository } from '../../product/repositories/product.repository';
import { CartIntput } from '../dtos/cart-input.dto';
import { ulid } from 'ulid';
import { plainToInstance } from 'class-transformer';
import { Cart } from '../entities/cart.entity';
import { ProductInCart } from '../entities/productInCart.entity';
import { CartOutput, ProductInCartOutput } from '../dtos/cart-ouput.dto';
import { Connection } from 'typeorm';
import { DeliveryService } from '../../delivery/services/delivery.service';
import { CalculateFeeIntput } from '../../delivery/dtos/calculate-fee-inpput';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productInCartRepository: ProductInCartRepository,
    private readonly productRepository: ProductRepository,
    private connection: Connection,
    private readonly deliveryService: DeliveryService,
  ) {}

  async createCart(userId: string, cartIntput: CartIntput) {
    const cartId = ulid();
    const newCart = plainToInstance(Cart, {
      cartId,
      userId,
      addressId: cartIntput.addressId,
      wardCode: cartIntput.wardCode,
      note: cartIntput.note,
    });

    const productIds = cartIntput.productsInCard.map(
      (product) => product.productId,
    );

    const foundProducts = await this.productRepository.getProductIds(
      productIds,
    );

    const productsInCart: ProductInCart[] = [];
    const productsInCartOutput: ProductInCartOutput[] = [];
    foundProducts.forEach((product) => {
      let amount: number = null;

      cartIntput.productsInCard.forEach((productInCart) => {
        if (productInCart.productId === product.productId)
          amount = productInCart.amount;
      });

      productsInCart.push(
        plainToInstance(ProductInCart, {
          cartId: cartId,
          productId: product.productId,
          amount: amount,
          price: product.price,
        }),
      );

      productsInCartOutput.push(
        plainToInstance(ProductInCartOutput, {
          amount: amount,
          ...product,
        }),
      );
    });

    await this.connection.transaction(async (trans) => {
      await trans.save(newCart);
      await trans.save(productsInCart);
    });

    const deliverFee = await this.deliveryService.calculateFee(
      plainToInstance(CalculateFeeIntput, {
        districtId: cartIntput.addressId,
        wardCode: cartIntput.wardCode,
      }),
    );

    return plainToInstance(
      CartOutput,
      {
        deliverFee: deliverFee.fee,
        ...newCart,
        productsInCard: productsInCartOutput,
      },
      { excludeExtraneousValues: true },
    );
  }

  async updateStatusPaid(cartId: string) {
    const cart = await this.cartRepository.findOne({
      where: { cartId: cartId },
    });

    if (!cart) throw new BadRequestException('Not found order');

    return await this.cartRepository.update(
      { cartId: cartId },
      { isPaid: true },
    );
  }

  async getCarts(userId: string, cartId: string) {
    const cartsOuput: CartOutput[] = [];

    const carts = await this.cartRepository.find({
      where: { userId: userId },
      relations: ['productsInCart', 'productsInCart.product'],
    });

    await Promise.all(
      carts.map(async (cart) => {
        const deliverFee = await this.deliveryService.calculateFee(
          plainToInstance(CalculateFeeIntput, {
            districtId: cart.addressId,
            wardCode: cart.wardCode,
          }),
        );

        const productsInCard: ProductInCartOutput[] = [];
        cart.productsInCart.forEach((productInCart) => {
          productsInCard.push(
            plainToInstance(ProductInCartOutput, {
              ...productInCart,
              ...productInCart.product,
            }),
          );
        });

        cartsOuput.push(
          plainToInstance(
            CartOutput,
            {
              deliverFee: deliverFee,
              productsInCard,
              ...cart,
            },
            { excludeExtraneousValues: true },
          ),
        );
      }),
    );

    return cartsOuput.filter((value) => {
      if (cartId !== undefined) return value.cartId === cartId;
      else return true;
    });
  }

  async deleteCart(cartId: string) {
    const deletedCart = await this.cartRepository.findOne({
      where: { cartId },
    });

    if (!deletedCart) throw new BadRequestException('Not found order');

    await this.productInCartRepository.delete({ cartId: cartId });
    return await this.cartRepository.softRemove(deletedCart);
  }
}
