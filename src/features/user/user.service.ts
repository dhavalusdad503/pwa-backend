import User from "../../models/user.model";
import userRepository from "./user.repository";

export interface IUserService {
  // registerUser(userData: {
  //   name: string;
  //   email: string;
  //   password: string;
  // }): Promise<User>;
  // loginUser(
  //   email: string,
  //   password: string
  // ): Promise<{ user: User; token: string }>;
  updateUser(
    id: number,
    userData: { name?: string; email?: string }
  ): Promise<User>;
  getUserById(id: number): Promise<User>;
  deleteUser(id: number): Promise<boolean>;
}

class UserService implements IUserService {
  // async registerUser(userData: {
  //   name: string;
  //   email: string;
  //   password: string;
  // }): Promise<User> {
  //   const existingUser = await userRepository.findByEmail(userData.email);
  //   if (existingUser) {
  //     throw new Error("Email is already in use");
  //   }

  //   const hashedPassword = await bcrypt.hash(userData.password, 10);

  //   return await userRepository.create({
  //     name: userData.name,
  //     email: userData.email,
  //     password: hashedPassword,
  //   } as User);
  // }

  // async loginUser(
  //   email: string,
  //   password: string
  // ): Promise<{ user: User; token: string }> {
  //   const user = await userRepository.findByEmail(email);
  //   if (!user) {
  //     throw new Error("Invalid email or password");
  //   }

  //   const isPasswordValid = await user.comparePassword(password);
  //   if (!isPasswordValid) {
  //     throw new Error("Invalid email or password");
  //   }

  //   const token = user.generateToken();

  //   return { user, token };
  // }

  async updateUser(
    id: number,
    userData: { name?: string; email?: string }
  ): Promise<User> {
    if (!id || isNaN(+id)) {
      throw new Error("Valid User ID is required for update");
    }

    const existingUser = await userRepository.findById(id);
    if (!existingUser) {
      throw new Error("User not found");
    }

    return await userRepository.update(id, userData);
  }

  async getUserById(id: number): Promise<User> {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async deleteUser(id: number): Promise<boolean> {
    return await userRepository.delete(id);
  }
}

export default new UserService();
