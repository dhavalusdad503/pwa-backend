import { AuthProvider } from "@enums";
import { joiCommon } from "@helper/joi-schema.helper";
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
