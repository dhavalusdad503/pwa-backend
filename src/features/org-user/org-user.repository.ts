import { Transaction } from "sequelize";
import OrgUser from "../../models/org-user.model";
import { BaseRepository } from "../../repository/base.repository";

export interface IOrgUserRepository {
  findById(id: string): Promise<OrgUser | null>;
  create(data: Partial<OrgUser>): Promise<OrgUser>;
  update(
    id: string,
    data: Partial<OrgUser>,
    transaction?: Transaction
  ): Promise<OrgUser>;
  delete(id: string): Promise<boolean>;
  findAll(): Promise<OrgUser[]>;
  count(): Promise<number>;
}

class OrgUserRepository
  extends BaseRepository<OrgUser>
  implements IOrgUserRepository
{
  constructor() {
    super(OrgUser);
  }

  async dataExists(): Promise<boolean> {
    const count = await this.count();
    return count > 0;
  }
}

export default new OrgUserRepository();
