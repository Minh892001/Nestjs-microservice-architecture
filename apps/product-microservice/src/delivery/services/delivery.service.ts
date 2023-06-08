import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Observable, catchError, lastValueFrom, map } from 'rxjs';
import { BaseApiErrorObject } from '../../../../../shared/dtos/base-microservice-response.dto';
import { AxiosResponse } from 'axios';
import { CalculateFeeOutput } from '../dtos/calculate-fee-output';
import { plainToInstance } from 'class-transformer';
import { CalculateFeeIntput } from '../dtos/calculate-fee-inpput';

@Injectable()
export class DeliveryService {
  constructor(private httpService: HttpService) {}

  async getProvince() {
    const result = await this.httpService.get(
      'https://online-gateway.ghn.vn/shiip/public-api/master-data/province',
      {
        headers: {
          token: 'e7cb2478-c6f8-11ed-b190-ea4934f9883e',
        },
      },
    );

    const response = await this.handleAuth0Response(result);
    if (response.error) {
      throw new InternalServerErrorException(
        `${response.error}: ${response.error_description || response.message}`,
      );
    }
    return response.data;
  }

  async getDistrictsOfProvince(provinceId: number) {
    const result = await this.httpService.post(
      'https://online-gateway.ghn.vn/shiip/public-api/master-data/district',
      {
        province_id: provinceId,
      },
      {
        headers: {
          token: 'e7cb2478-c6f8-11ed-b190-ea4934f9883e',
        },
      },
    );

    const response = await this.handleAuth0Response(result);
    if (response.error) {
      throw new InternalServerErrorException(
        `${response.error}: ${response.error_description || response.message}`,
      );
    }
    return response.data;
  }

  async getWardsOfDistrict(districtId: number) {
    const result = await this.httpService.post(
      'https://online-gateway.ghn.vn/shiip/public-api/master-data/ward',
      {
        district_id: districtId,
      },
      {
        headers: {
          token: 'e7cb2478-c6f8-11ed-b190-ea4934f9883e',
        },
      },
    );

    const response = await this.handleAuth0Response(result);
    if (response.error) {
      throw new InternalServerErrorException(
        `${response.error}: ${response.error_description || response.message}`,
      );
    }
    return response.data;
  }

  async calculateFee(
    calculateFeeInput: CalculateFeeIntput,
  ): Promise<CalculateFeeOutput> {
    const result = await this.httpService.post(
      'https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee',
      {
        service_id: 53321,
        insurance_value: 500000,
        coupon: null,
        from_district_id: 1482,
        to_district_id: calculateFeeInput.districtId,
        to_ward_code: calculateFeeInput.wardCode,
        height: 15,
        length: 15,
        weight: 1000,
        width: 15,
      },
      {
        headers: {
          token: 'e7cb2478-c6f8-11ed-b190-ea4934f9883e',
          shop_id: '3931321',
        },
      },
    );

    const response = await this.handleAuth0Response(result);
    if (response.error) {
      throw new InternalServerErrorException(
        `${response.error}: ${response.error_description || response.message}`,
      );
    }
    return plainToInstance(CalculateFeeOutput, { fee: response.data.total });
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
