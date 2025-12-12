import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import jwtConfig from 'src/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { JwtTokenService } from './jwt-token.service';

@Module({
  controllers: [AuthController],
  imports: [UserModule, JwtModule.register(jwtConfig)],
  providers: [AuthService, JwtTokenService]
})
export class AuthModule { }
