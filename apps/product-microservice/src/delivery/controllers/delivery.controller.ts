import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { DeliveryService } from '../services/delivery.service';
import { CalculateFeeIntput } from '../dtos/calculate-fee-inpput';

@Controller('delivery')
export class DeliveryController {
  constructor(private deliverService: DeliveryService) {}

  @Get('/provinces')
  async getProvinces() {
    return await this.deliverService.getProvince();
  }

  @Get('/districts/:provinceId')
  async getDistricts(@Param('provinceId') provinceId: string) {
    const id = Number.parseInt(provinceId);
    return await this.deliverService.getDistrictsOfProvince(id);
  }

  @Get('/wards/:districtId')
  async getWards(@Param('districtId') districtId: string) {
    const id = Number.parseInt(districtId);
    return await this.deliverService.getWardsOfDistrict(id);
  }

  @Post()
  async calculateFee(@Body() calculateFeeInput: CalculateFeeIntput) {
    return await this.deliverService.calculateFee(calculateFeeInput);
  }
}
