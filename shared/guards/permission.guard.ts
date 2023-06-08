import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as moment from 'moment';
import {
  PERMISSION_KEY,
  PERMISSION_TOKEN_KEY,
} from '../../shared/constants/common';
import { UserDetail } from '../../shared/dtos/user-detail.dto';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const permisions = this.reflector.get<string[]>(
      PERMISSION_KEY,
      context.getHandler(),
    );
    const now = moment().unix();

    if (!permisions) {
      return true;
    }

    let userDetail: UserDetail;
    const permissionToken = context
      .switchToHttp()
      .getRequest()
      .header(PERMISSION_TOKEN_KEY);

    try {
      if (!permissionToken) {
        return false;
      }
      userDetail = JSON.parse(
        Buffer.from(permissionToken, 'base64').toString('binary'),
      );
    } catch (err) {
      return false;
    }

    if (userDetail.exp < now) {
      throw new BadRequestException('Token is expired');
    }

    const userPermissions = userDetail.roles
      .map((role) => role.roleName)
      .flat();

    const hasPermissions = permisions.some((permission) =>
      userPermissions.includes(permission),
    );
    if (hasPermissions) {
      return true;
    }
    return false;
  }
}
