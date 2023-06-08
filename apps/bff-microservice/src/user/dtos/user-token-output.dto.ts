import { Expose } from 'class-transformer';
import { UserOutput } from './user-output.dto';

export class UserTokenOutput {
  @Expose()
  token: string;

  @Expose()
  detail: UserOutput;
}
