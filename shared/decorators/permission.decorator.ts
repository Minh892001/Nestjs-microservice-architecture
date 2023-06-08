import { SetMetadata } from '@nestjs/common';
import { PERMISSION_KEY } from '../constants/common';

export const Permissions = (...permission: string[]) =>
  SetMetadata(PERMISSION_KEY, permission);
