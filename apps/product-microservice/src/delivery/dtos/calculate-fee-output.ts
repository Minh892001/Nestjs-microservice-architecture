import { Expose } from 'class-transformer';

export class CalculateFeeOutput {
  @Expose()
  fee: number;
}
