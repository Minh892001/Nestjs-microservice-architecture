import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestContext } from '../dtos/request-context.dto';
import { createRequestContext } from './utils';

export const ReqContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): RequestContext => {
    const request = ctx.switchToHttp().getRequest();

    return createRequestContext(request);
  },
);
