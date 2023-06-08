import { Expose } from 'class-transformer';
import { IsInt, IsNumber, IsString } from 'class-validator';

export class ItemDetail {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  description: string;

  @Expose()
  @IsInt()
  quantity: number;

  @Expose()
  @IsNumber()
  price: number;

  @Expose()
  @IsNumber()
  tax: number;

  @Expose()
  @IsString()
  currency = 'USD';
}

export class ItemInputDto {
  @Expose()
  items: ItemDetail[];
}
