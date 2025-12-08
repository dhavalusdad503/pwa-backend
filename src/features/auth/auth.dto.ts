import { AuthProvider } from "@enums";
import { joiCommon } from "@helper/joi-schema.helper";
import { User } from "@models";
import Joi from "joi";

export const registerSchema = Joi.object({
  firstName: joiCommon.joiString.max(100).required(),
  lastName: joiCommon.joiString.max(100).required(),
  password: joiCommon.joiString.min(8).required(),
  authProvider: joiCommon.joiString
    .valid(...Object.values(AuthProvider))
    .required(),
  phone: joiCommon.joiString.max(20),
  email: joiCommon.joiEmail.required(),
});

export const loginSchema = Joi.object({
  password: joiCommon.joiString.required(),
  email: joiCommon.joiEmail.required(),
  is_remember_me: joiCommon.joiBoolean.optional(),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: joiCommon.joiString.required(),
});

export const forgotPasswordSchema = Joi.object({
  email: joiCommon.joiEmail.required(),
});

export const validateTokenSchema = Joi.object({
  token: joiCommon.joiString.required(),
});

export const resetPasswordSchema = Joi.object({
  new_password: joiCommon.joiString.min(8).required(),
  token: joiCommon.joiString,
});

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface SendResetPasswordDto {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
}

export interface TokenPayload {
  id: string;
  email: string;
  tokenExpiryDate: Date;
}

export interface ResetPasswordDto {
  token: string;
  new_password: string;
}

export interface UpdatePasswordDto {
  user_id: string;
  password: string;
}

export interface LoginResponseDto {
  user: User;
  token: string;
  refreshToken: string;
}
