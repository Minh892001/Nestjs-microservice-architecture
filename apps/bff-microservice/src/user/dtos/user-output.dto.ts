import { Expose } from 'class-transformer';

export class UserOutput {
  @Expose()
  userId: string;

  @Expose()
  password: string;

  @Expose()
  auth0userId: string;

  @Expose()
  email: string;

  @Expose()
  photoUrl: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  name: string;

  @Expose()
  phone: string;

  @Expose()
  dateOfBirth: Date;

  @Expose()
  address: string;

  @Expose()
  type: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
