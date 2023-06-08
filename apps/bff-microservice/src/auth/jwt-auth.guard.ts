import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { STRATEGY_JWT_AUTH } from './constant';

@Injectable()
export class JwtAuthGuard extends AuthGuard(STRATEGY_JWT_AUTH) {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new UnauthorizedException(info);
    }
    return user;
  }
}
