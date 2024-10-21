import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const createTypeOrmConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: configService.get<'mysql'>('DB_TYPE'), // نوع دیتابیس
  host: configService.get<string>('DB_HOST'), // هاست دیتابیس
  port: configService.get<number>('DB_PORT'), // پورت
  username: configService.get<string>('DB_USERNAME'), // نام کاربری
  password: configService.get<string>('DB_PASSWORD'), // رمز عبور
  database: configService.get<string>('DB_NAME'), // نام دیتابیس
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true,
});
