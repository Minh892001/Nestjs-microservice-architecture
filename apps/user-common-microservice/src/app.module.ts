import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from '../../../shared/share.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigurationModule } from './config/configuration.module';
import { EmailController } from './email/controllers/email.controller';
import { EmailModule } from './email/email.module';
import { RoleController } from './user/controllers/role.controller';
import { Role } from './user/entities/role.entity';
import { UserAuthority } from './user/entities/user-authority.entity';
import { User } from './user/entities/user.entity';
import { S3Module } from './s3/s3.module';
import { SmsModule } from './sms/sms.module';
import { UserModule } from './user/user.module';
import { GoogleModule } from './google/google.module';

@Module({
  imports: [
    UserModule,
    EmailModule,
    GoogleModule,
    SharedModule,
    ConfigurationModule,
    SmsModule,
    S3Module,
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('email.smtpHost'),
          auth: {
            user: configService.get<string>('email.smtpUsername'),
            pass: configService.get<string>('email.smtpPassword'),
          },
        },
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('database.host'),
        port: configService.get<number>('database.port'),
        username: configService.get<string>('database.username'),
        password: configService.get<string>('database.password'),
        database: configService.get<string>('database.name'),
        entities: [User, Role, UserAuthority],
        synchronize: true,
      }),
    }),
  ],
  controllers: [AppController, RoleController, EmailController],
  providers: [AppService],
})
export class AppModule {}
