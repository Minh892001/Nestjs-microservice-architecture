import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';

export class ProductIntput {
  @IsNotEmpty()
  productName: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  price: number;

  description: string;

  photoUrl: string;

  @IsNotEmpty()
  @IsInt()
  quantity: number;
}
