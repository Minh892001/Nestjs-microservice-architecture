import { Expose } from 'class-transformer';

export class BaseApiErrorObject {
  public statusCode: number;

  public message: string;

  public timestamp: string;
}

export class BaseMicroserviceResponse<T> {
  @Expose()
  meta?: any;

  [key: string]: any;

  data?: T;

  @Expose()
  error?: BaseApiErrorObject;
}
