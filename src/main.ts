import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {


        // جستجوی خطای مرتبط با whitelist
        const whiteListError = errors.find(item => {
          return item.constraints && item.constraints['whitelistValidation'];
        });

        if (whiteListError) {
          return new BadRequestException('اطلاعات ارسالی غیرمجاز است. لطفاً فقط فیلدهای معتبر را ارسال کنید.');
        }

        // تبدیل خطاها به فرمت موردنظر
        const formattedErrors = errors.reduce((acc, err) => {
          // نام فیلد را به عنوان کلید اضافه می‌کنیم
          const field = err.property;

          // پیام‌های خطا را از constraints جمع‌آوری می‌کنیم
          const messages = Object.values(err.constraints);

          acc[field] = { messages };
          return acc;
        }, {});
        formattedErrors["statusCode"] = 400
        formattedErrors["error"] = "Bad Request"

        return new BadRequestException(formattedErrors);
      },
    }),
  );



  await app.listen(3000);
}
bootstrap();
