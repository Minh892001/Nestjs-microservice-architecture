import { IsInt, IsNotEmpty } from 'class-validator';

export class CalculateFeeIntput {
  @IsNotEmpty()
  @IsInt()
  districtId: number;
  @IsNotEmpty()
  wardCode: string;
}
