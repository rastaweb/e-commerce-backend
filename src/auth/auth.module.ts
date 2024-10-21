
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('AUTH_SECRET'),
        signOptions: { expiresIn: '69999999999990s' },
      }),
      inject: [ConfigService],
    }),
    UsersModule
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule { }
