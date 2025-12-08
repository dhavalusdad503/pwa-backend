import { ENV_CONFIG } from "@config/envConfig";
import { TEMPLATE_NAME } from "@constants";
import { Roles } from "@enums";
import {
  AUTH_MESSAGES,
  RESET_PASS_TOKEN_EXPIRY_MINUTES,
} from "@features/auth/auth.constant";
import { userService } from "@features/user";
import { combineName, decrypt, encrypt } from "@utils";
import { createJWTRefreshToken, createJWTToken } from "@utils/jwt";
import logger from "@utils/logger";
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

      await userRepository.update(id, {
        resetPassToken: token,
      });

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
      const { new_password, token } = data;

      const tokenData = decrypt(token);
      const tokenObj = tokenData && JSON.parse(tokenData);
      if (!tokenObj) {
        throw new Error(AUTH_MESSAGES.INVALID_TOKEN);
      }
      const { email, id, tokenExpiryDate } = tokenObj;

      if (new Date() > new Date(tokenExpiryDate)) {
        throw new Error(AUTH_MESSAGES.INVALID_TOKEN);
      }

      const user = await userService.findUserByEmail(email, [
        "id",
        "email",
        "password",
        "resetPassToken",
      ]);

      const storedToken = decodeURIComponent(user.resetPassToken || "");
      if (!user.resetPassToken || (storedToken && data.token !== storedToken)) {
        throw new Error(AUTH_MESSAGES.INVALID_TOKEN);
      }

      if (user.password) {
        const isSamePassword = await user.comparePassword(new_password);
        if (isSamePassword) {
          throw new Error(AUTH_MESSAGES.SAME_PREVIOUS_PASSWORD);
        }
      }

      const hashedPassword = await bcrypt.hash(data.new_password, 10);

      await userRepository.updateUserPassword(id, hashedPassword);

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
