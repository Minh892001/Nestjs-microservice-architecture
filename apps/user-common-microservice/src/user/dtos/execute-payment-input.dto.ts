import { IsString } from 'class-validator';

export class ExecutePaymentInput {
  @IsString()
  url: string;

  @IsString()
  payId: string;
}
