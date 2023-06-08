import { Module } from '@nestjs/common';
import { HttpRequestModule } from '../../../../shared/http-requests/http-request.module';
import { SharedModule } from '../../../../shared/share.module';
import { ConfigurationModule } from '../config/configuration.module';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';

@Module({
  imports: [SharedModule, ConfigurationModule, HttpRequestModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
