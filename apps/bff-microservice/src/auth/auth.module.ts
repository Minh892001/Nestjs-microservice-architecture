import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SharedModule } from '../../../../shared/share.module';
import { ConfigurationModule } from '../config/configuration.module';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { STRATEGY_JWT_AUTH } from './constant';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ConfigurationModule,
    UserModule,
    SharedModule,
    PassportModule.register({ defaultStrategy: STRATEGY_JWT_AUTH }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
