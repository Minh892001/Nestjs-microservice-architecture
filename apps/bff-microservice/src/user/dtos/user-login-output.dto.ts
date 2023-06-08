import { Expose } from 'class-transformer';

export class UserDetailInfo {
  @Expose()
  userId: string;

  @Expose()
  userType: string;
}

export class UserLoginOutput {
  @Expose()
  access_token: string;

  @Expose()
  scope: string;

  @Expose()
  expires_in: number;

  @Expose()
  token_type: string;

  @Expose()
  payload: UserDetailInfo;
}
