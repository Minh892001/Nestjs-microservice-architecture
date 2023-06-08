import { Expose } from 'class-transformer';

export class Auth0UserOutput {
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

  @Expose({
    name: 'email_verified',
  })
  emailVerified: boolean;

  @Expose({
    name: 'given_name',
  })
  givenName: string;

  @Expose({
    name: 'family_name',
  })
  familyName: string;

  @Expose({
    name: 'updated_at',
  })
  updatedAt: Date;
}
