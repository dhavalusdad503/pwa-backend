import { Roles } from "@enums";
import { createJWTRefreshToken, createJWTToken } from "@utils/jwt";
import bcrypt from "bcrypt";
import Role from "../../models/roles.model";
import User from "../../models/user.model";
import userRepository from "../user/user.repository";
import { LoginDto, RegisterDto } from "./auth.dto";

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

  async login(
    data: LoginDto
  ): Promise<{ user: User; token: string; refreshToken: string }> {
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
}

export default new AuthService();
