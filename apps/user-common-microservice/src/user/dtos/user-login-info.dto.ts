import { IsNotEmpty, IsString } from 'class-validator';

export class UserLoginInfo {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
