import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthTokenPayload } from '../types';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:
        configService.get('jwt.jwtSecret') ??
        process.env.JWT_SECRET ??
        'defaultSecretKey',
    });
  }

  validate(payload: AuthTokenPayload) {
    const user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      role_id: payload.role_id,
      org_id: payload.org_id,
    };
    return user;
  }
}
