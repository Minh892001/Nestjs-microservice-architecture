import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductInCart } from './productInCart.entity';

@Entity({ name: 'cart' })
export class Cart {
  @PrimaryColumn({
    name: 'cart_id',
    type: 'char',
    length: 26,
  })
  cartId: string;

  @Column({
    name: 'user_id',
    type: 'char',
    length: 26,
    nullable: false,
  })
  userId: string;

  @Column({
    name: 'is_paid',
    type: 'boolean',
    default: false,
  })
  isPaid: boolean;

  @Column({
    name: 'address_id',
    type: 'int',
  })
  addressId: number;

  @Column({
    name: 'ward_code',
    type: 'varchar',
    length: 10,
  })
  wardCode: string;

  @Column({
    name: 'note',
    type: 'varchar',
    nullable: true,
    length: 100,
  })
  note: string;

  @OneToMany(() => ProductInCart, (productInCart) => productInCart.cart)
  productsInCart: ProductInCart[];

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    nullable: true,
  })
  deletedAt: Date;
}
