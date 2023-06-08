import { Expose, Type } from 'class-transformer';

export class CartOutput {
  @Expose()
  cartId: string;

  @Expose()
  userId: string;

  @Expose()
  isPaid: boolean;

  @Expose()
  addressId: number;

  @Expose()
  wardCode: string;

  @Expose()
  deliverFee: number;

  @Expose()
  note: string;

  @Expose()
  productsInCard: ProductInCartOutput[];
}

export class ProductInCartOutput {
  @Expose()
  productId: string;
  @Expose()
  productName: string;
  @Expose()
  type: string;
  @Expose()
  price: number;
  @Expose()
  description: string;
  @Expose()
  photoUrl: string;
  @Expose()
  amount: number;
}
