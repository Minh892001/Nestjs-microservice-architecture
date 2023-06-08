import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ProductInCart } from '../entities/productInCart.entity';

@Injectable()
export class ProductInCartRepository extends Repository<ProductInCart> {
  constructor(private dataSource: DataSource) {
    super(ProductInCart, dataSource.createEntityManager());
  }
}
