import { Transaction } from 'sequelize';
import User from '../../models/user.model';
import { BaseRepository } from '../../repository/base.repository';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  create(userData: Partial<User>): Promise<User>;
  update(id: number, userData: Partial<User>, transaction?: Transaction): Promise<User>;
  delete(id: number): Promise<boolean>;
  findAll(): Promise<User[]>;
  count(): Promise<number>;
}

class UserRepository extends BaseRepository<User> implements IUserRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.findOne({ where: { email } });
  }

}

export default new UserRepository();
