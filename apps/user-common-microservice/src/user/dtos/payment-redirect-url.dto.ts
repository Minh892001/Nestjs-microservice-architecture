import { IsString } from 'class-validator';

export class PaymentRedirectUrlDto {
  @IsString()
  return_url: string;

  @IsString()
  cancel_url: string;
}
