import jwt, { SignOptions } from "jsonwebtoken";
// import { AuthTokenPayload, InvitePayload } from '@features/auth/auth.types';
import { ENV_CONFIG } from "@config/envConfig";
import { AuthTokenPayload } from "@features/auth/auth.types";

type ExpiresIn = SignOptions["expiresIn"];

const { JWT_SECRET_KEY } = ENV_CONFIG;

export const createJWTToken = (
  payload: AuthTokenPayload,
  expiresIn: ExpiresIn = "24h"
): string => {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, JWT_SECRET_KEY, options);
};

export const createJWTRefreshToken = (
  payload: AuthTokenPayload,
  expiresIn: ExpiresIn = "7d"
): string => {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, JWT_SECRET_KEY, options);
};

export const verifyJWTToken = (token: string): AuthTokenPayload => {
  return jwt.verify(token, JWT_SECRET_KEY) as AuthTokenPayload;
};

export const decodeJWTToken = (token: string): AuthTokenPayload => {
  return jwt.decode(token) as AuthTokenPayload;
};
