import { CreateOptions, InferCreationAttributes, Transaction } from 'sequelize';
import Role from '../../models/roles.model';
import { BaseRepository } from '../../repository/base.repository';

export interface IRoleRepository {
  findById(id: string): Promise<Role | null>;
  create(roleData: Partial<Role>): Promise<Role>;
  update(id: string, roleData: Partial<Role>, transaction?: Transaction): Promise<Role>;
  delete(id: string): Promise<boolean>;
  findAll(): Promise<Role[]>;
  count(): Promise<number>;
  findByName(name: string): Promise<Role | null>;
  findBySlug(slug: string): Promise<Role | null>;
}

class RoleRepository extends BaseRepository<Role> implements IRoleRepository {
  constructor() {
    super(Role);
  }

  async findByName(name: string): Promise<Role | null> {
    return await this.findOne({ where: { name } });
  }

  async findBySlug(slug: string): Promise<Role | null> {
    return await this.findOne({ where: { slug } });
  }

  async dataExists(): Promise<boolean> {
    const count = await this.count();
    return count > 0;
  }
}

export default new RoleRepository();
