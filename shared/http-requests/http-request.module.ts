import { HttpRequestService } from './http-request.service';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [HttpRequestService],
  exports: [HttpRequestService],
})
export class HttpRequestModule {}
