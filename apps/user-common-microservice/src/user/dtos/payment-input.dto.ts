import { IsOptional, IsString } from 'class-validator';
import { PaymentMethodDto } from './payment-method.dto';
import { PaymentRedirectUrlDto } from './payment-redirect-url.dto';
import { PaymentTransactionInputDto } from './payment-transaction-input.dto';

export class PaymentInputDto {
  @IsOptional()
  @IsString()
  intent?: string = 'sale';

  payer: PaymentMethodDto;

  transactions: PaymentTransactionInputDto[];

  redirect_urls: PaymentRedirectUrlDto;
}
