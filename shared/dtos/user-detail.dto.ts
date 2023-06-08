import { Expose } from 'class-transformer';
import { RoleOutput } from '../../apps/user-common-microservice/src/user/dtos/role-output.dto';
import { USER_TYPE } from '../../shared/constants/common';

export class UserDetail {
  @Expose()
  userId: string;

  @Expose()
  type: USER_TYPE;

  @Expose()
  auth0userId?: string;

  @Expose()
  roles: RoleOutput[];

  @Expose()
  exp: number;
}
