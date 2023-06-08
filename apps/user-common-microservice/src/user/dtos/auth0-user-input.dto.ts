import { Expose } from 'class-transformer';

export class Auth0UserInput {
  @Expose({
    name: 'user_id',
  })
  userId: string;

  @Expose()
  email: string;

  @Expose()
  blocked: boolean;

  @Expose()
  name: string;

  @Expose()
  password: string;

  @Expose()
  connection: string;

  @Expose({
    name: 'verify_email',
  })
  verifyEmail: boolean;

  @Expose({
    name: 'given_name',
  })
  givenName: string;

  @Expose({
    name: 'family_name',
  })
  familyName: string;
}
