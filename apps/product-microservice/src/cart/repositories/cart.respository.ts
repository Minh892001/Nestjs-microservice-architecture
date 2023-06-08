import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Cart } from '../entities/cart.entity';

@Injectable()
export class CartRepository extends Repository<Cart> {
  constructor(private dataSource: DataSource) {
    super(Cart, dataSource.createEntityManager());
  }

  async getCartIds(cartIds: string[]): Promise<Cart[]> {
    const queryBuilder = this.createQueryBuilder('carts').where(
      'carts.cartId IN (:cartIds)',
      { cartIds: cartIds },
    );
    return await queryBuilder.getMany();
  }
}
