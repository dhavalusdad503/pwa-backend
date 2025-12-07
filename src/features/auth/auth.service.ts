import { ENV_CONFIG } from "@config/envConfig";
import { TEMPLATE_NAME } from "@constants";
import { Roles } from "@enums";
import {
  AUTH_MESSAGES,
  REDIS_RESET_PASSWORD_KEY_PREFIX,
  RESET_PASS_TOKEN_EXPIRY_MINUTES,
} from "@features/auth/auth.constant";
import { combineName, encrypt } from "@utils";
import { createJWTRefreshToken, createJWTToken } from "@utils/jwt";
import logger from "@utils/logger";
import RedisService from "@utils/redisService";
import { sendMail } from "@utils/sendMail";
import bcrypt from "bcrypt";
import { addMinutes } from "date-fns";
import Role from "../../models/roles.model";
import User from "../../models/user.model";
import userRepository from "../user/user.repository";
import {
  LoginDto,
  LoginResponseDto,
  RegisterDto,
  ResetPasswordDto,
  SendResetPasswordDto,
} from "./auth.dto";

export interface IAuthService {
  register(data: RegisterDto): Promise<User>;
  login(data: LoginDto): Promise<{ user: User; token: string }>;
}

class AuthService implements IAuthService {
  async register(data: RegisterDto): Promise<User> {
    const existingUser = await userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new Error("Email is already in use");
    }

    const userRoleId = (
      await Role.findOne({ where: { name: Roles.CAREGIVER } })
    )?.id;

    const hashedPassword = await bcrypt.hash(data.password, 10);
    return await userRepository.create({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPassword,
      roleId: userRoleId,
    } as User);
  }

  async login(data: LoginDto): Promise<LoginResponseDto> {
    const user = await userRepository.findByEmailWithRole(data.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }
    const isPasswordValid = await user.comparePassword(data.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }
    const AuthTokenPayload = {
      id: user.id,
      email: user.email,
    };
    const token = createJWTToken(AuthTokenPayload);
    const refreshToken = createJWTRefreshToken(AuthTokenPayload);

    return { user, token, refreshToken };
  }

  async sendResetPasswordLink(data: SendResetPasswordDto) {
    try {
      const { id, email, firstName, lastName } = data;

      const token = encrypt(
        JSON.stringify({
          id,
          email,
          tokenExpiryDate: addMinutes(
            new Date(),
            RESET_PASS_TOKEN_EXPIRY_MINUTES
          ),
        })
      );

      const redisClient = RedisService.getClient();

      await redisClient.set(
        `${REDIS_RESET_PASSWORD_KEY_PREFIX}_${id}`,
        token,
        "EX",
        Number(RESET_PASS_TOKEN_EXPIRY_MINUTES) * 60
      );

      const commonPath = `/reset-password?token=${token}`;
      sendMail({
        subject: `Reset your password`,
        templateName: TEMPLATE_NAME.FORGOT_PASSWORD,
        to: [email],
        replacement: {
          name: combineName({ names: [firstName, lastName] }),
          redirect_url: `${ENV_CONFIG.FRONTEND_BASE_URL}${commonPath}`,
        },
      });
    } catch (error) {
      logger.error("Error in sendResetPasswordLink service", error);
      throw error;
    }
  }

  async resetPassword(data: ResetPasswordDto): Promise<LoginResponseDto> {
    try {
      const { new_password } = data;
      const { email, id, tokenExpiryDate } = data.token;

      const redisClient = RedisService.getClient();
      const redisKey = `${REDIS_RESET_PASSWORD_KEY_PREFIX}_${id}`;
      const redisValue = await redisClient.get(redisKey);

      if (!redisValue) {
        logger.error("Token not found or already used.");
        throw new Error(AUTH_MESSAGES.INVALID_TOKEN);
      }

      if (new Date() > new Date(tokenExpiryDate)) {
        await redisClient.del(redisKey);
        throw new Error(AUTH_MESSAGES.INVALID_TOKEN);
      }

      const user = await userRepository.findByEmail(email, [
        "id",
        "email",
        "password",
      ]);

      if (!user) {
        logger.error("resetPassword service User not found");
        throw new Error(AUTH_MESSAGES.USER_NOT_FOUND);
      }

      if (user.password) {
        const isSamePassword = await user.comparePassword(new_password);
        if (isSamePassword) {
          throw new Error(AUTH_MESSAGES.SAME_PREVIOUS_PASSWORD);
        }
      }

      const hashedPassword = await bcrypt.hash(data.new_password, 10);

      await userRepository.update(id, {
        password: hashedPassword,
      });

      await redisClient.del(redisKey);
      logger.info(`Reset token deleted from redis: ${redisKey}`);

      const loginData = await this.login({
        email,
        password: data.new_password,
      });

      return loginData;
    } catch (error) {
      logger.error("Error in resetPassword service", error);
      throw error;
    }
  }
}

export default new AuthService();
