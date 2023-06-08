import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductRepository extends Repository<Product> {
  constructor(private dataSource: DataSource) {
    super(Product, dataSource.createEntityManager());
  }

  async getProductIds(productIds: string[]): Promise<Product[]> {
    const queryBuilder = this.createQueryBuilder('products').where(
      'products.productId IN (:productIds)',
      { productIds: productIds },
    );
    return await queryBuilder.getMany();
  }

  async getProducts(search: string): Promise<Product[]> {
    const queryBuilder = this.createQueryBuilder('products');

    if (search) {
      queryBuilder.andWhere('products.productName LIKE :search', {
        search: `%${search}%`,
      });
    }

    return queryBuilder.getMany();
  }
}
