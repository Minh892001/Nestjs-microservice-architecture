import { AmountDetailDto } from './payment-transaction-input.dto';

export class UserPaymentInputDto {
  total: number;

  details: AmountDetailDto;
}
