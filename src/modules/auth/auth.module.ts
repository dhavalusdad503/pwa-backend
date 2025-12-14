import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IJwtOptions } from '@/common/types';
import { jwtConfig } from '@/config/jwt.config';
import { OrganizationModule } from '../organization/organization.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtTokenService } from './jwt-token.service';

@Module({
  controllers: [AuthController],
  imports: [
    PassportModule,
    UserModule,
    OrganizationModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const opts = configService.get<IJwtOptions>('jwt');
        return {
          ...jwtConfig(opts),
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, JwtTokenService, LocalStrategy],
})
export class AuthModule {}
