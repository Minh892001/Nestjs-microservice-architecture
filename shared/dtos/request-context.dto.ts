import { UserDetail } from './user-detail.dto';

export class RequestContext {
  public ip: string;

  public url: string;

  public requestID: string;

  public user: UserDetail | any;
}
