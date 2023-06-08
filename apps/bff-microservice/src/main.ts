import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.enableCors({
    credentials: true,
    origin: ['http://localhost:3000', 'http://localhost:3003'],
  });

  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('APP_PORT'));
}
bootstrap();
