import { Roles } from "@enums";
import { UserRepository } from "@features/user";
import { extractErrorMessage } from "@helper";
import { OrgUser, Role } from "@models";
import { CommonPaginationOptionType, CommonPaginationResponse } from "@types";
import logger from "@utils/logger";
import { Transaction } from "sequelize";
import User from "../../models/user.model";

class UserService {
  private userRepository: typeof UserRepository;

  constructor() {
    this.userRepository = UserRepository;
  }

  async findUserByEmail(email: string, attributes?: string[]): Promise<User> {
    const user = await this.userRepository.findByEmail(email, attributes);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async updateUserPassword(
    userId: number,
    password: string,
    transaction?: Transaction
  ): Promise<void> {
    try {
      await this.userRepository.updateUserPassword(
        userId,
        password,
        transaction
      );
    } catch (error) {
      logger.error("Error in updateUserPassword", error);
      const message = extractErrorMessage(error, "Internal server error");
      throw new Error(message);
    }
  }

  async updateUser(
    id: number,
    userData: { name?: string; email?: string }
  ): Promise<User> {
    if (!id || isNaN(+id)) {
      throw new Error("Valid User ID is required for update");
    }

    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error("User not found");
    }

    return await this.userRepository.update(id, userData);
  }

  async getResetPasswordTokenUsingUserId(data: { user_id: string }) {
    try {
      const { user_id } = data;
      const token = await this.userRepository.getResetPassTokenByUserId({
        user_id,
      });
      return token;
    } catch (error) {
      logger.error("Error in getResetPasswordTokenUsingUserId", error);
      const message = extractErrorMessage(error, "Internal server error");
      throw new Error(message);
    }
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

  async deleteUser(id: number): Promise<boolean> {
    return await this.userRepository.delete(id);
  }

  async getAllCaregivers(
    orgId: string,
    params: CommonPaginationOptionType
  ): Promise<CommonPaginationResponse<User>> {
    try {
      const res =
        await this.userRepository.findAllWithPaginationWithSortAndSearch({
          ...params,
          attributes: ["id", "firstName", "lastName", "email", "phone"],
          include: [
            {
              model: OrgUser,
              required: true,
              as: "userOrgs",
              where: { orgId },
              attributes: [],
            },
            {
              model: Role,
              required: true,
              as: "role",
              where: { slug: Roles.CAREGIVER },
              attributes: [],
            },
          ],
        });

      return res;
    } catch (error) {
      logger.error("Error in getAllCaregivers service", error);
      const message = extractErrorMessage(error, "Internal server error");
      throw new Error(message);
    }
  }
}

export default new UserService();
