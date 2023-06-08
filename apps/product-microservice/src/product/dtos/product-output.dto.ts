import { Expose } from 'class-transformer';

export class ProductOutput {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  type: string;

  @Expose()
  price: number;

  @Expose()
  description: string;

  @Expose()
  photoUrl: string;

  @Expose()
  quantity: number;
}
