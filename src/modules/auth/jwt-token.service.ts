// src/auth/jwt-token.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { AuthTokenPayload } from '../../common/types';

export type ExpiresIn = JwtSignOptions['expiresIn'];

// Adapt this to your real payload type

@Injectable()
export class JwtTokenService {
  constructor(private readonly jwtService: JwtService) {}

  createJWTToken(
    payload: AuthTokenPayload,
    expiresIn: ExpiresIn = '24h',
  ): string {
    const options: JwtSignOptions = { expiresIn };
    return this.jwtService.sign(payload, options);
  }

  createJWTRefreshToken(
    payload: AuthTokenPayload,
    expiresIn: ExpiresIn = '7d',
  ): string {
    const options: JwtSignOptions = { expiresIn };
    return this.jwtService.sign(payload, options);
  }

  verifyJWTToken(token: string): AuthTokenPayload {
    return this.jwtService.verify<AuthTokenPayload>(token);
  }
  decodeJWTToken(token: string): AuthTokenPayload | null {
    return this.jwtService.decode(token);
  }
}
