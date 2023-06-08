import { USER_ROLE } from '../../../../../shared/constants/common';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class RoleInput {
  @IsNotEmpty()
  @IsEnum(USER_ROLE)
  roleName: string;
}
