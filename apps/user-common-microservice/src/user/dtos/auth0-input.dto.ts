import { Expose } from 'class-transformer';

export class Auth0Input {
  @Expose({
    name: 'grant_type',
  })
  grantType = 'client_credentials';

  @Expose({
    name: 'client_id',
  })
  clientId: string;

  @Expose({
    name: 'client_secret',
  })
  clientSecret: string;

  audience: string;
}
