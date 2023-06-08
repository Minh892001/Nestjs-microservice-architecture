import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class CartInput {
  @IsNotEmpty()
  @IsNumber()
  addressId: number;

  @IsNotEmpty()
  wardCode: string;

  note: string;

  @IsNotEmpty()
  productsInCard: ProductInCartInput[];
}

export class ProductInCartInput {
  @IsNotEmpty()
  productId: string;

  @IsNotEmpty()
  @IsInt()
  amount: number;
}
