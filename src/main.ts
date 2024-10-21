import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { customizedValidationPipe } from './config/pipes/validateion.pipe';
dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(
    customizedValidationPipe
  );

  await app.listen(3000);
}
bootstrap();
