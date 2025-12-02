import { Transaction } from "sequelize";
import Patient from "../../models/patient.model";
import { BaseRepository } from "../../repository/base.repository";

export interface IPatientRepository {
  findById(id: string): Promise<Patient | null>;
  create(data: Partial<Patient>): Promise<Patient>;
  update(
    id: string,
    data: Partial<Patient>,
    transaction?: Transaction
  ): Promise<Patient>;
  delete(id: string): Promise<boolean>;
  findAll(): Promise<Patient[]>;
  count(): Promise<number>;
  findPatientByName(name: string): Promise<Patient | null>;
}

class PatientRepository
  extends BaseRepository<Patient>
  implements IPatientRepository
{
  constructor() {
    super(Patient);
  }

  async dataExists(): Promise<boolean> {
    const count = await this.count();
    return count > 0;
  }
  async findPatientByName(name: string): Promise<Patient | null> {
    return await this.findOne({ where: { name } });
  }
}

export default new PatientRepository();
