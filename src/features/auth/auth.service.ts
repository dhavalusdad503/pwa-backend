import { TEMPLATE_NAME } from "@constants";
import { Roles } from "@enums";
import {
  AUTH_MESSAGES,
  RESET_PASS_TOKEN_EXPIRY_MINUTES,
} from "@features/auth/auth.constant";
import { combineName, encrypt } from "@utils";
import { createJWTRefreshToken, createJWTToken } from "@utils/jwt";
import logger from "@utils/logger";
import { sendMail } from "@utils/sendMail";
import bcrypt from "bcrypt";
import { addMinutes } from "date-fns";
import dotenv from "dotenv";
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

dotenv.config();

export interface IAuthService {
  register(data: RegisterDto): Promise<User>;
  login(data: LoginDto): Promise<{ user: User; token: string }>;
}

export const { FRONTEND_BASE_URL } = process.env;

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

      const commonPath = `/reset-password?token=${token}`;
      sendMail({
        subject: `Reset your password`,
        templateName: TEMPLATE_NAME.FORGOT_PASSWORD,
        to: [email],
        replacement: {
          name: combineName({ names: [firstName, lastName] }),
          redirect_url: `${FRONTEND_BASE_URL}${commonPath}`,
        },
      });
    } catch (error) {
      logger.error("Error in sendResetPasswordLink service", error);
      throw error;
    }
  }

  async resetPassword(data: ResetPasswordDto): Promise<LoginResponseDto> {
    try {
      const { email, id } = data.token;

      const user = await userRepository.findByEmail(email, [
        "id",
        "email",
        "password",
      ]);

      if (!user) {
        logger.error("resetPassword service User not found");
        throw new Error(AUTH_MESSAGES.USER_NOT_FOUND);
      }

      if (new Date() > new Date(data.token.tokenExpiryDate)) {
        logger.error("resetPassword service Token Invalid");
        throw new Error(AUTH_MESSAGES.INVALID_TOKEN);
      }

      if (!user.password) {
        const hashedPassword = await bcrypt.hash(data.new_password, 10);
        await userRepository.update(id, {
          password: hashedPassword,
        });

        const loginData = await this.login({
          email,
          password: data.new_password,
        });

        return loginData;
      }

      const isCurrentPasswordSame = await user.comparePassword(
        data.new_password
      );
      if (isCurrentPasswordSame) {
        throw new Error(AUTH_MESSAGES.SAME_PREVIOUS_PASSWORD);
      }

      const hashedPassword = await bcrypt.hash(data.new_password, 10);
      await userRepository.update(id, {
        password: hashedPassword,
      });

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
