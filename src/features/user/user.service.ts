import { Roles } from "@enums";
import userRepository from "@features/user/user.repository";
import usersFieldsMap from "@features/user/utils";
import { extractErrorMessage } from "@helper";
import { OrgUser, Role } from "@models";
import { CommonPaginationOptionType, CommonPaginationResponse } from "@types";
import { buildSelectedColumns } from "@utils";
import { buildDynamicQuery } from "@utils/dynamicFieldsQueryBuilder";
import logger from "@utils/logger";
import { Op, Transaction } from "sequelize";
import User from "../../models/user.model";

class UserService {
  private userRepository: typeof userRepository;

  constructor() {
    this.userRepository = userRepository;
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

  async getAllUsers(
    orgId: string,
    role: string,
    params: CommonPaginationOptionType & {
      userType?: string
      columns?: string | string[]
    }
  ): Promise<CommonPaginationResponse<User>> {
    try {
      const { limit = 10, page = 1, sortColumn = 'createdAt', sortOrder = 'DESC', search = '' } = params;
      const offset = (page - 1) * limit;


      if (role === Roles.SUPERVISOR && params.userType?.toUpperCase() === Roles.SUPERVISOR) {
        params.userType = Roles.CAREGIVER;
      }

      const defaultColumns = ["id", "firstName", "lastName", "email", "phone", "createdAt", "updatedAt"];

      const where = {
        firstName: { [Op.iLike]: `%${search}%` },
        lastName: { [Op.iLike]: `%${search}%` },
        email: { [Op.iLike]: `%${search}%` },
      }

      const selectedColumns = buildSelectedColumns({
        columns: params.columns,
        defaultColumns: defaultColumns
      })

      const dynamicQuery = buildDynamicQuery(
        usersFieldsMap,
        defaultColumns,
        params.columns,
        {
          page,
          limit,
          offset,
          order: sortColumn && sortOrder ? [[sortColumn, sortOrder]] : [['createdAt', 'DESC']],
          where
        }
      )

      if (!dynamicQuery.include) {
        dynamicQuery.include = [];
      }

      const includeArray = Array.isArray(dynamicQuery.include)
        ? dynamicQuery.include
        : [dynamicQuery.include];

      // Add or update userOrgs association
      let userOrgsInclude: any = includeArray.find((inc: any) => inc.as === 'userOrgs');
      if (!userOrgsInclude) {
        userOrgsInclude = {
          model: OrgUser,
          as: 'userOrgs',
          attributes: [],
          required: true
        };
        includeArray.push(userOrgsInclude);
      }
      userOrgsInclude.where = { orgId };
      userOrgsInclude.required = true;

      // Add or update role association
      let roleInclude: any = includeArray.find((inc: any) => inc.as === 'role');
      if (!roleInclude) {
        roleInclude = {
          model: Role,
          as: 'role',
          attributes: [],
          required: true
        };
        includeArray.push(roleInclude);
      }
      roleInclude.where = params.userType
        ? { slug: params.userType.toUpperCase() }
        : { slug: Roles.CAREGIVER };
      roleInclude.required = true;

      // Update dynamicQuery with the modified include array
      dynamicQuery.include = includeArray;

      const res =
        await this.userRepository.findAllWithPagination({
          page: page,
          limit: limit,
          offset: offset,
          order: sortColumn && sortOrder ? [[sortColumn, sortOrder]] : [['createdAt', 'DESC']],
          where,
          attributes: selectedColumns,
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
              where: { ...(params.userType ? { slug: params?.userType?.toUpperCase() } : { slug: Roles.CAREGIVER }) },
              attributes: [],
            },
          ],
        });

      return res;
    } catch (error) {
      logger.error("Error in getAllUsers service", error);
      const message = extractErrorMessage(error, "Internal server error");
      throw new Error(message);
    }
  }
}

export default new UserService();
