import { UserInputDto } from './../dtos/user-input.dto';
import { PERMISSION_TOKEN_KEY } from './../../../../../shared/constants/common';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserOutput } from '../dtos/user-output.dto';
import { RequestContext } from '../../../../../shared/dtos/request-context.dto';
import { HttpRequestService } from '../../../../../shared/http-requests/http-request.service';
import { UserLoginInfo } from '../dtos/user-login-info.dto';
import { UserLoginOutput } from '../dtos/user-login-output.dto';

const pathUsers = '/users';
const pathSendEmail = '/email/send-email';
const pathResetPassword = '/reset-password';

@Injectable()
export class UserService {
  constructor(
    private readonly configService: ConfigService,
    private httpService: HttpRequestService,
  ) {}

  async getUser(ctx: RequestContext, userId: string): Promise<any> {
    const userMicroserviceUrl = this.configService.get<string>(
      'microservice.userCommon',
    );
    const apiUrl = `${userMicroserviceUrl}${pathUsers}/${userId}`;
    const response = await this.httpService.get<UserOutput>(apiUrl, {
      headers: {
        [PERMISSION_TOKEN_KEY]: ctx.user.token,
      },
    });
    return response;
  }

  async createUser(ctx: RequestContext, userInput: UserInputDto) {
    const userMicroserviceUrl = this.configService.get<string>(
      'microservice.userCommon',
    );
    const apiCreateUrl = `${userMicroserviceUrl}${pathUsers}`;

    const newUser = await this.httpService.post<UserOutput>(
      apiCreateUrl,
      userInput,
      {
        headers: {
          [PERMISSION_TOKEN_KEY]: ctx.user.token,
        },
      },
    );

    if (newUser.error) {
      throw new BadRequestException(newUser.error.message);
    }

    const { userId, firstName, lastName, email } = newUser.data;

    const apiResetPasswordUrl = `${userMicroserviceUrl}${pathUsers}${pathResetPassword}/${userId}`;
    const changePasswordTicket = await this.httpService.get<{
      ticketUrl: string;
    }>(apiResetPasswordUrl, {
      headers: {
        [PERMISSION_TOKEN_KEY]: ctx.user.token,
      },
    });

    if (changePasswordTicket.error) {
      throw new BadRequestException(changePasswordTicket.error.message);
    }

    const ticketUrl = changePasswordTicket.data;
    const apiSendChangePasswordUrl = `${userMicroserviceUrl}${pathSendEmail}`;
    await this.httpService.post<any>(
      apiSendChangePasswordUrl,
      {
        subject: 'Change Password',
        content: ticketUrl,
        name: `${firstName} ${lastName}`,
      },
      {
        headers: {
          [PERMISSION_TOKEN_KEY]: ctx.user.token,
        },
        params: {
          fromEmail: this.configService.get<string>('email.from'),
          toEmail: 'minhpt8901@gmail.com',
        },
      },
    );
    return newUser.data;
  }

  async getUserAccessInfo(userId: string, detail: boolean): Promise<any> {
    const userMicroserviceUrl = this.configService.get<string>(
      'microservice.userCommon',
    );
    const apiUrl = `${userMicroserviceUrl}${pathUsers}/${userId}/token`;
    const response = await this.httpService.get<UserOutput>(apiUrl, {
      params: {
        detail: detail,
      },
    });
    return response;
  }

  async login(userLoginInfo: UserLoginInfo): Promise<UserLoginOutput> {
    const userMicroserviceUrl = this.configService.get<string>(
      'microservice.userCommon',
    );
    const apiUrl = `${userMicroserviceUrl}${pathUsers}/token`;
    const response = await this.httpService.post<UserLoginOutput>(
      apiUrl,
      userLoginInfo,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    if (response.error) {
      throw new BadRequestException(response.error);
    }
    const userInfo = JSON.parse(atob(response.data.access_token.split('.')[1]));
    const userId = userInfo.sub.split('|')[1];
    const userDetailInfo = await this.getUserAccessInfo(userId, true);
    return {
      ...response.data,
      payload: {
        userId: userDetailInfo.detail.userId,
        userType: userDetailInfo.detail.type,
      },
    };
  }

  async confirmPayment(paymentInput) {
    const userMicroserviceUrl = this.configService.get<string>(
      'microservice.userCommon',
    );
  }
}
