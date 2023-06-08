import { Expose } from 'class-transformer';

export class EmailInputDto {
  @Expose()
  subject: string;

  @Expose()
  content: string;

  @Expose()
  name: string;
}
