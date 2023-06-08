import { Expose } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { ItemInputDto } from './item-input.dto';

export class AmountDetailDto {
  @Expose()
  @IsNumber()
  subtotal: number;

  @Expose()
  @IsNumber()
  tax: number;

  @Expose()
  @IsNumber()
  shipping: number;

  @Expose()
  @IsNumber()
  handling_fee: number;

  @Expose()
  @IsNumber()
  shipping_discount: number;

  @Expose()
  @IsNumber()
  insurance: number;
}

export class AmountInputDto {
  @IsNumber()
  total: number;

  currency = 'USD';

  details: AmountDetailDto;
}

export class PaymentTransactionInputDto {
  amount: AmountInputDto;

  item_list: ItemInputDto[];
}
