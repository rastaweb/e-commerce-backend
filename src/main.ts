import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { customizedValidationPipe } from './config/pipes/validateion.pipe';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.use(helmet());
  app.useGlobalPipes(customizedValidationPipe);
  app.use(cookieParser());
  const uploadDir = join(process.cwd(), process.env.UPLOAD_DIR);
  if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir);
  }
  app.use(process.env.UPLOAD_DIR, express.static(uploadDir));
  await app.listen(3000);
}
bootstrap();
