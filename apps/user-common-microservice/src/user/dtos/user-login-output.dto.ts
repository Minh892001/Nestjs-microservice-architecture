import { Expose } from 'class-transformer';

export class UserLoginOutput {
  @Expose()
  access_token: string;

  @Expose()
  scope: string;

  @Expose()
  expires_in: number;

  @Expose()
  token_type: string;
}
