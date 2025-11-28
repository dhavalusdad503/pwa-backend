import bcrypt from "bcrypt";
import User from "../../models/user.model";
import userRepository from "../user/user.repository";
import { LoginDto, RegisterDto, ResponseLoginData } from "./auth.dto";
import Role from "../../models/roles.model";
import { Roles } from "@enums";
import roleRepository from "@repository/role.repository";

export interface IAuthService {
  register(data: RegisterDto): Promise<User>;
  login(data: LoginDto): Promise<{ user: ResponseLoginData; token: string }>;
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
  ): Promise<{ user: ResponseLoginData; token: string }> {
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }
    const { roleId, firstName, lastName, email, authProvider, id } = user;

    const role = await roleRepository.findById(roleId);

    const { name, slug } = role;

    const a = role?.dataValues.slug;

    const isPasswordValid = await user.comparePassword(data.password);
    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }
    const userData = {
      firstName,
      lastName,
      email,
      authProvider,
      id,
      role: {
        name,
        slug,
        roleId,
      },
    };

    const token = user.generateToken();

    return { user: userData, token };
  }
}

export default new AuthService();
