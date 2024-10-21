import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createTypeOrmConfig } from './database.config';

export const GlobalModules = [
    ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: process.env.NODE_ENV === 'production'
            ? '.env.production'
            : ['.env.development'],
    }),
    TypeOrmModule.forRootAsync({
        useFactory: (configService: ConfigService) => createTypeOrmConfig(configService),
        inject: [ConfigService],
    }),
];
