import { Role } from "@models";
import { Transaction } from "sequelize";
import User from "../../models/user.model";
import { BaseRepository } from "../../repository/base.repository";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findByEmailWithRole(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  create(userData: Partial<User>): Promise<User>;
  update(
    id: number,
    userData: Partial<User>,
    transaction?: Transaction
  ): Promise<User>;
  delete(id: number): Promise<boolean>;
  findAll(): Promise<User[]>;
  count(): Promise<number>;
}

class UserRepository extends BaseRepository<User> implements IUserRepository {
  constructor() {
    super(User);
  }

  async getResetPassTokenByUserId(data: {
    user_id: string;
  }): Promise<string | null | undefined> {
    const { user_id } = data;
    const userData = await this.findOne({
      where: { id: user_id },
      attributes: ["resetPassToken"],
    });
    return userData?.resetPassToken;
  }

  async findByEmail(
    email: string,
    attributes?: string[]
  ): Promise<User | null> {
    return await this.findOne({
      where: { email },
      attributes,
    });
  }

  async findByEmailWithRole(email: string): Promise<User | null> {
    return await this.findOne({
      where: { email },
      include: [{ model: Role, as: "role" }],
    });
  }

  async updateUserPassword(
    id: string | number,
    password: string,
    transaction?: Transaction
  ): Promise<User> {
    return await this.update(
      id,
      { password, resetPassToken: null },
      transaction
    );
  }

  async dataExists(): Promise<boolean> {
    const count = await this.count();
    return count > 0;
  }
}

export default new UserRepository();
