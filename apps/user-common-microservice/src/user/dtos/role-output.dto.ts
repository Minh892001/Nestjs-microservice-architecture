import { Expose } from 'class-transformer';

export class RoleOutput {
  @Expose()
  roleId: string;

  @Expose()
  roleName: string;
}
