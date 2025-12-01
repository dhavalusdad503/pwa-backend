import jwt, { SignOptions } from "jsonwebtoken";
// import { AuthTokenPayload, InvitePayload } from '@features/auth/auth.types';
import { JWT_CONFIG } from "@constants";
import { AuthTokenPayload } from "@features/auth/auth.types";

type ExpiresIn = SignOptions["expiresIn"];

const JWT_SECRET = JWT_CONFIG.SECRET;

export const createJWTToken = (
  payload: AuthTokenPayload,
  expiresIn: ExpiresIn = "24h"
): string => {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const createJWTRefreshToken = (
  payload: AuthTokenPayload,
  expiresIn: ExpiresIn = "7d"
): string => {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyJWTToken = (token: string): AuthTokenPayload => {
  return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
};

export const decodeJWTToken = (token: string): AuthTokenPayload => {
  return jwt.decode(token) as AuthTokenPayload;
};
