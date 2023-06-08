import { Expose } from 'class-transformer';

export class Auth0UserLogin {
  @Expose({
    name: 'grant_type',
  })
  grantType = 'password';

  @Expose()
  scope = 'profile email';

  @Expose({
    name: 'client_id',
  })
  clientId: string;

  @Expose({
    name: 'client_secret',
  })
  clientSecret: string;

  connection: string;

  username: string;

  password: string;

  audience: string;
}
