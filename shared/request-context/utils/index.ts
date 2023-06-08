import { plainToInstance } from 'class-transformer';
import { Request } from 'express';
import {
  FORWARDED_FOR_TOKEN_HEADER,
  PERMISSION_TOKEN_KEY,
  REQUEST_ID_TOKEN_HEADER,
} from '../../constants/common';
import { RequestContext } from '../../dtos/request-context.dto';
import { UserDetail } from '../../dtos/user-detail.dto';

export function createRequestContext(request: Request) {
  const ctx = new RequestContext();
  ctx.requestID = request.header(REQUEST_ID_TOKEN_HEADER);
  ctx.url = request.url;
  ctx.ip = request.header(FORWARDED_FOR_TOKEN_HEADER)
    ? request.header(FORWARDED_FOR_TOKEN_HEADER)
    : request.ip;

  const headerUser = request.header('user');
  if (request['user']) {
    ctx.user = request['user'];
  } else if (headerUser) {
    ctx.user = JSON.parse(headerUser);
  }

  const permissionToken = request.header(PERMISSION_TOKEN_KEY);
  if (permissionToken) {
    try {
      const userDetail: UserDetail = JSON.parse(
        Buffer.from(permissionToken, 'base64').toString('binary'),
      );
      if (userDetail) {
        ctx.user = plainToInstance(UserDetail, userDetail, {
          excludeExtraneousValues: true,
        });
      }
    } catch (error) {
      ctx.user = {};
    }
  }

  return ctx;
}
