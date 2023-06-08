import { Module } from '@nestjs/common';
import { GoogleService } from './services/google.service';
import { GoogleController } from './controllers/google.controller';
import { GoogleStrategy } from './Strategies/google.strategy';
import { UserRepository } from '../user/repositories/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [GoogleService, GoogleStrategy, UserRepository],
  controllers: [GoogleController],
})
export class GoogleModule {}
