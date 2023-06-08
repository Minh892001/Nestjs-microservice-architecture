import { Module } from '@nestjs/common';
import { SharedModule } from '../../../shared/share.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigurationModule } from './config/configuration.module';
import { UserModule } from './user/user.module';
import { CartModule } from './cart/cart.module';

@Module({
  imports: [SharedModule, ConfigurationModule, UserModule, AuthModule, CartModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
