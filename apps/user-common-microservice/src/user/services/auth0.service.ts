import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Auth0Input } from '../dtos/auth0-input.dto';
import * as qs from 'qs';
import { Auth0UserInput } from '../dtos/auth0-user-input.dto';
import { Auth0UserOutput } from '../dtos/auth0-user-output.dto';
import { Auth0UserLogin } from '../dtos/auth0-user-login.dto';
import { UserLoginOutput } from '../dtos/user-login-output.dto';
import { HttpService } from '@nestjs/axios';
import { BaseApiErrorObject } from '../../../../../shared/dtos/base-microservice-response.dto';
import { AxiosResponse } from 'axios';
import { catchError, lastValueFrom, map, Observable } from 'rxjs';

const TOKEN_PATH = '/oauth/token';
const VERSION_API = '/api/v2/';
const USER_PATH = 'users';
const TICKET_PATH = 'tickets';
const CHANGE_PASSWORD_PATH = '/password-change';

@Injectable()
export class Auth0Service {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async getToken(): Promise<string> {
    const auth0Url = this.configService.get<string>('auth0.baseUrl');
    const endpoint = `${auth0Url}${TOKEN_PATH}`;

    const input = new Auth0Input();
    input.clientId = this.configService.get<string>('auth0.clientId');
    input.clientSecret = this.configService.get<string>('auth0.clientSecret');
    input.audience = `${auth0Url}${VERSION_API}`;
    const observableResp = await this.httpService.post(
      endpoint,
      qs.stringify(instanceToPlain(input)),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    const response = await this.handleAuth0Response(observableResp);
    if (response.error) {
      throw new InternalServerErrorException(
        `${response.error}:${response.error_description || response.message}`,
      );
    }
    return response.access_token;
  }

  async getUserToken(
    username: string,
    password: string,
  ): Promise<UserLoginOutput> {
    const auth0Url = this.configService.get<string>('auth0.baseUrl');
    const endpoint = `${auth0Url}${TOKEN_PATH}`;

    const input = new Auth0UserLogin();
    input.clientId = this.configService.get<string>('auth0.ssaClientId');
    input.clientSecret = this.configService.get<string>(
      'auth0.ssaClientSecret',
    );
    input.connection = this.configService.get<string>('auth0.connectionName');
    input.audience = `${auth0Url}${VERSION_API}`;
    input.username = username;
    input.password = password;

    const observableResp = await this.httpService.post(
      endpoint,
      instanceToPlain(input),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );
    const response = await this.handleAuth0Response(observableResp);
    if (response.error) {
      console.log(
        'ihqweiurhiu',
        `${response.error}:${response.error_description || response.message}`,
      );
      throw new InternalServerErrorException(
        `${response.error}:${response.error_description || response.message}`,
      );
    }
    return response;
  }

  async getChangePasswordTicket(userId: string, access_token: string) {
    const auth0Url = this.configService.get<string>('auth0.baseUrl');
    const ticketEndpoint = `${auth0Url}${VERSION_API}${TICKET_PATH}${CHANGE_PASSWORD_PATH}`;

    const observableResp = await this.httpService.post(
      ticketEndpoint,
      {
        user_id: userId,
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    const response = await this.handleAuth0Response(observableResp);
    if (response.error) {
      throw new InternalServerErrorException(
        `${response.error}:${response.error_description || response.message}`,
      );
    }
    return response.ticket;
  }

  async createAuth0User(
    userAuth0Input: Auth0UserInput,
    access_token: string,
  ): Promise<Auth0UserOutput> {
    const auth0Url = this.configService.get<string>('auth0.baseUrl');
    const userEndpoint = `${auth0Url}${VERSION_API}${USER_PATH}`;

    userAuth0Input.connection = this.configService.get<string>(
      'auth0.connectionName',
    );
    const observableResp = this.httpService.post(
      userEndpoint,
      instanceToPlain(userAuth0Input),
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      },
    );
    const response = await this.handleAuth0Response(observableResp);
    if (response.error) {
      throw new InternalServerErrorException(
        `${response.error}: ${response.error_description || response.message}`,
      );
    }
    return plainToInstance(Auth0UserOutput, response, {
      excludeExtraneousValues: true,
    });
  }

  private async handleAuth0Response(observable: Observable<AxiosResponse>) {
    const resp = observable.pipe(
      map((response) => (response ? response.data : response)),
      catchError(async (e) => {
        return this.handleAuth0Error(e);
      }),
    );
    return lastValueFrom(resp);
  }

  private handleAuth0Error(e: any) {
    const errorData = e.response?.data;
    if (errorData) {
      return errorData;
    }
    const err = new BaseApiErrorObject();
    err.message = e.message;
    return { error: err };
  }
}
