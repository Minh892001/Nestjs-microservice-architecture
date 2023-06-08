import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { plainToInstance } from 'class-transformer';
import * as moment from 'moment';
import { catchError, lastValueFrom, map, Observable } from 'rxjs';
import {
  BaseApiErrorObject,
  BaseMicroserviceResponse,
} from '../dtos/base-microservice-response.dto';

@Injectable()
export class HttpRequestService {
  constructor(private readonly httpService: HttpService) {}

  async get<T>(url: string, config?: AxiosRequestConfig) {
    if (!config) {
      config = { headers: {} };
    }
    const response = await this.httpService.get(url, config);
    return this.handleResponse<T>(response);
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig) {
    if (!config) {
      config = { headers: {} };
    }
    const response = await this.httpService.post(url, data, config);
    return this.handleResponse<T>(response);
  }

  private async handleResponse<T>(observable: Observable<AxiosResponse<T>>) {
    const resp = observable.pipe(
      map((response) => (response ? response.data : response)),
      catchError(async (e) => {
        return this.handleError<T>(e);
      }),
    );

    return lastValueFrom<BaseMicroserviceResponse<T>>(resp);
  }

  private handleError<T>(e: any): BaseMicroserviceResponse<T> {
    if (e.response) {
      const errDetail = new BaseApiErrorObject();
      errDetail.statusCode = e.response.data.statusCode;
      errDetail.message = e.response.data.message;
      errDetail.timestamp = moment().toISOString();
      return plainToInstance<BaseMicroserviceResponse<T>, any>(
        BaseMicroserviceResponse,
        {
          error: errDetail,
        },
      );
    }
    const err = new BaseApiErrorObject();
    err.message = e.message;
    return { error: err };
  }
}
