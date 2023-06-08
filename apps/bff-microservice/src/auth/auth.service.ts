import { Injectable } from '@nestjs/common';
import { UserTokenOutput } from '../user/dtos/user-token-output.dto';
import { UserService } from '../user/services/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async getUserAccessInfo(
    userId: string,
    detail: boolean,
  ): Promise<UserTokenOutput> {
    return this.userService.getUserAccessInfo(userId, detail);
  }
}
