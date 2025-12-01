import { Transaction } from "sequelize";
import Organization from "../../models/organization.model";
import { BaseRepository } from "../../repository/base.repository";

export interface IOrganizationRepository {
  findById(id: string): Promise<Organization | null>;
  create(data: Partial<Organization>): Promise<Organization>;
  update(
    id: string,
    data: Partial<Organization>,
    transaction?: Transaction
  ): Promise<Organization>;
  delete(id: string): Promise<boolean>;
  findAll(): Promise<Organization[]>;
  count(): Promise<number>;
  findByName(name: string): Promise<Organization | null>;
}

class OrganizationRepository
  extends BaseRepository<Organization>
  implements IOrganizationRepository
{
  constructor() {
    super(Organization);
  }

  async findByName(name: string): Promise<Organization | null> {
    return await this.findOne({ where: { name } });
  }

  async dataExists(): Promise<boolean> {
    const count = await this.count();
    return count > 0;
  }
}

export default new OrganizationRepository();
