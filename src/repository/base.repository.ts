import {
  CreateOptions,
  FindOptions,
  Model,
  ModelStatic,
  Transaction,
} from "sequelize";

export interface IBaseRepository<T extends Model> {
  findById(id: string | number, options?: FindOptions): Promise<T | null>;
  findAll(options?: FindOptions): Promise<T[]>;
  findOne(options: FindOptions): Promise<T | null>;
  create(data: Partial<T>, options?: CreateOptions): Promise<T>;
  update(
    id: string | number,
    data: Partial<T>,
    transaction?: Transaction
  ): Promise<T>;
  delete(id: string | number): Promise<boolean>;
  count(options?: FindOptions): Promise<number>;
}

export abstract class BaseRepository<T extends Model>
  implements IBaseRepository<T>
{
  protected model: ModelStatic<T>;

  constructor(model: ModelStatic<T>) {
    this.model = model;
  }

  async bulkCreate(
    data: Partial<T["_creationAttributes"]>[],
    options?: CreateOptions
  ): Promise<T[]> {
    return (await this.model.bulkCreate(
      data as T["_creationAttributes"][],
      options
    )) as T[];
  }

  async findById(
    id: string | number,
    options?: FindOptions
  ): Promise<T | null> {
    return (await this.model.findByPk(id, options)) as T | null;
  }

  async findAll(options?: FindOptions): Promise<T[]> {
    return (await this.model.findAll(options)) as T[];
  }

  async findOne(options: FindOptions): Promise<T | null> {
    return (await this.model.findOne(options)) as T | null;
  }
  async create(
    data: Partial<T["_creationAttributes"]>,
    options?: CreateOptions
  ): Promise<T> {
    return (await this.model.create(
      data as T["_creationAttributes"],
      options
    )) as T;
  }

  async update(
    id: string | number,
    data: Partial<T>,
    transaction?: Transaction
  ): Promise<T> {
    const instance = await this.model.findByPk(id, { transaction });
    if (!instance) {
      throw new Error(`${this.model.name} not found`);
    }
    return (await instance.update(data, { transaction })) as T;
  }

  async delete(id: string | number): Promise<boolean> {
    const instance = await this.model.findByPk(id);
    if (!instance) {
      return false;
    }
    await instance.destroy();
    return true;
  }

  async count(options?: FindOptions): Promise<number> {
    return await this.model.count(options);
  }
}
