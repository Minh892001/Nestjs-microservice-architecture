import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'product' })
export class Product {
  @PrimaryColumn({
    name: 'product_id',
    type: 'char',
    length: 26,
  })
  productId: string;

  @Column({
    name: 'product_name',
    type: 'varchar',
    length: 100,
  })
  productName: string;

  @Column({
    name: 'type',
    type: 'varchar',
    length: 100,
  })
  type: string;

  @Column({
    name: 'price',
    type: 'int',
  })
  price: number;

  @Column({
    name: 'description',
    type: 'varchar',
    nullable: true,
    length: 100,
  })
  description: string;

  @Column({
    name: 'photoUrl',
    type: 'varchar',
    nullable: true,
    length: 1000,
  })
  photoUrl: string;

  @Column({
    name: 'quantity',
    type: 'int',
  })
  quantity: number;

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
