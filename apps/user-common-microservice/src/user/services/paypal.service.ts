import { ExecutePaymentInput } from './../dtos/execute-payment-input.dto';
import { HttpRequestService } from './../../../../../shared/http-requests/http-request.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentInputDto } from '../dtos/payment-input.dto';
import { instanceToPlain } from 'class-transformer';
import { HttpService } from '@nestjs/axios';
import { catchError, lastValueFrom, map, Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { BaseApiErrorObject } from '../../../../../shared/dtos/base-microservice-response.dto';

const PAYPAL_VERSION = '/v1';
const PAYMENT_URL = '/payments/payment';
const AUTH_URL = '/oauth2/token';

@Injectable()
export class PaypalService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async executePaymentToken(input: ExecutePaymentInput) {
    const paypalUrl = this.configService.get<string>('paypal.baseUrl');
    const paypalAuthToken = this.configService.get<string>('paypal.authToken');
    const paymentAccessTokenEndpoint = `${paypalUrl}${PAYPAL_VERSION}${AUTH_URL}`;
    const accessTokenResp = await this.httpService.post(
      paymentAccessTokenEndpoint,
      { grant_type: 'client_credentials' },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${paypalAuthToken}`,
        },
      },
    );
    const accessToken = await this.handlePaypalResponse(accessTokenResp);
    if (accessToken.error) {
      throw new InternalServerErrorException(
        `${accessToken.error}: ${
          accessToken.error_description || accessToken.message
        }`,
      );
    }
    const execute = await this.httpService.post(
      input.url,
      { payer_id: input.payId },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken.access_token}`,
        },
      },
    );
    const response = await this.handlePaypalResponse(execute);
    if (response.error) {
      throw new InternalServerErrorException(
        `${response.error}: ${response.error_description || response.message}`,
      );
    }
    return response;
  }

  async getPaymentUrl(paymentInput: PaymentInputDto) {
    const paypalUrl = this.configService.get<string>('paypal.baseUrl');
    const paypalAuthToken = this.configService.get<string>('paypal.authToken');
    const paymentAccessTokenEndpoint = `${paypalUrl}${PAYPAL_VERSION}${AUTH_URL}`;
    const paymentEndpoint = `${paypalUrl}${PAYPAL_VERSION}${PAYMENT_URL}`;
    const accessTokenResp = await this.httpService.post(
      paymentAccessTokenEndpoint,
      { grant_type: 'client_credentials' },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${paypalAuthToken}`,
        },
      },
    );
    const accessToken = await this.handlePaypalResponse(accessTokenResp);
    if (accessToken.error) {
      throw new InternalServerErrorException(
        `${accessToken.error}: ${
          accessToken.error_description || accessToken.message
        }`,
      );
    }

    const observablaResp = await this.httpService.post(
      paymentEndpoint,
      instanceToPlain(paymentInput),
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken.access_token}`,
        },
      },
    );
    const response = await this.handlePaypalResponse(observablaResp);
    if (response.error) {
      throw new InternalServerErrorException(
        `${response.error}: ${response.error_description || response.message}`,
      );
    }
    return response;
  }

  private async handlePaypalResponse(observable: Observable<AxiosResponse>) {
    const resp = observable.pipe(
      map((response) => (response ? response.data : response)),
      catchError(async (e) => {
        return this.handlePaypalError(e);
      }),
    );
    return lastValueFrom(resp);
  }

  private handlePaypalError(e: any) {
    const errorData = e.response?.data;
    if (errorData) {
      return errorData;
    }
    const err = new BaseApiErrorObject();
    err.message = e.message;
    return { error: err };
  }
}
