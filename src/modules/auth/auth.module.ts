import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from '@modules/user/user.module';
import { OrganizationModule } from '@modules/organization/organization.module';
import { IJwtOptions } from '@common/types';
import { jwtConfig } from '@config/jwt.config';
import { JwtTokenService } from './jwt-token.service';
import { LocalStrategy } from './strategies/local.strategy';
import { MailModule } from '@shared/mail/mail.module';

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
    MailModule,
  ],
  providers: [AuthService, JwtTokenService, LocalStrategy],
})
export class AuthModule {}
