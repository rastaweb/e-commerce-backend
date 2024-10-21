import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createTypeOrmConfig } from './database.config';

export const GlobalModules = [
    TypeOrmModule.forRootAsync({
        useFactory: (configService: ConfigService) => createTypeOrmConfig(configService),
        inject: [ConfigService],
      }),
    ConfigModule.forRoot({
        isGlobal: true, // ماژول گلوبال باشه
        envFilePath: process.env.NODE_ENV === 'production'
            ? '.env.production'
            : ['.env.development'], // برای توسعه و لوکال
    }),
];
