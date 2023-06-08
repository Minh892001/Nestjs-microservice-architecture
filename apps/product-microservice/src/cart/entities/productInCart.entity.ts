import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../../product/entities/product.entity';

@Entity({ name: 'product_in_cart' })
export class ProductInCart {
  @PrimaryColumn({
    type: 'char',
    length: 26,
    name: 'cart_id',
  })
  cartId: string;

  @PrimaryColumn({
    type: 'char',
    length: 26,
    name: 'product_id',
  })
  productId: string;

  @ManyToOne(() => Cart)
  @JoinColumn({
    name: 'cart_id',
    referencedColumnName: 'cartId',
  })
  cart: Cart;

  @ManyToOne(() => Product)
  @JoinColumn({
    name: 'product_id',
    referencedColumnName: 'productId',
  })
  product: Product;

  @Column({
    name: 'amount',
    type: 'int',
  })
  amount: number;

  @Column({
    name: 'price',
    type: 'int',
  })
  price: number;
}
