import { Transaction } from "sequelize";
import Visit from "../../models/visit.model";
import { BaseRepository } from "../../repository/base.repository";

export interface IVisitRepository {
  findById(id: string): Promise<Visit | null>;
  create(visitData: Partial<Visit>): Promise<Visit>;
  update(
    id: string,
    visitData: Partial<Visit>,
    transaction?: Transaction
  ): Promise<Visit>;
  delete(id: string): Promise<boolean>;
  findAll(options?: any): Promise<Visit[]>;
  count(): Promise<number>;
}

class VisitRepository
  extends BaseRepository<Visit>
  implements IVisitRepository
{
  constructor() {
    super(Visit);
  }

  async dataExists(): Promise<boolean> {
    const count = await this.count();
    return count > 0;
  }
}

export default new VisitRepository();
