import {
  AggregateOptions,
  CreateOptions,
  DestroyOptions,
  FindOptions,
  Model,
  ModelStatic,
  Op,
  Order,
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
  destroy(
    where: FindOptions<T>["where"],
    options?: DestroyOptions,
    transaction?: Transaction
  ): Promise<number>;
  findAllWithPagination(
    options?: FindOptions &
      AggregateOptions<T> & {
        page?: number;
        limit?: number;
      }
  ): Promise<{
    data: T[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  }>;
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
    options?: CreateOptions,
    transaction?: Transaction
  ): Promise<T> {
    return await this.model.create(data as T["_creationAttributes"], {
      ...options,
      transaction,
    });
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

  async delete(
    id: string | number,
    transaction?: Transaction
  ): Promise<boolean> {
    const instance = await this.model.findByPk(id, { transaction });
    if (!instance) {
      return false;
    }
    await instance.destroy();
    return true;
  }

  async count(options?: FindOptions): Promise<number> {
    return await this.model.count(options);
  }

  async destroy(
    where: FindOptions<T>["where"],
    options?: DestroyOptions,
    transaction?: Transaction
  ): Promise<number> {
    return await this.model.destroy({
      where,
      ...options,
      transaction,
      individualHooks: true,
    });
  }

  async findOrCreate(
    where: FindOptions<T>["where"],
    defaults: Partial<T["_creationAttributes"]>,
    options?: CreateOptions,
    transaction?: Transaction
  ): Promise<[T, boolean]> {
    return await this.model.findOrCreate({
      where,
      defaults: defaults as T["_creationAttributes"],
      ...options,
      transaction,
    });
  }

  async findAllWithPagination(
    options?: FindOptions &
      AggregateOptions<T> & {
        page?: number;
        limit?: number;
      }
  ): Promise<{
    data: T[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  }> {
    const { page = 1, limit = 10 } = options as {
      page?: number;
      limit?: number;
    };

    const { rows: data, count } = await this.model.findAndCountAll({
      ...options,
      distinct: true,
      // col: 'id',
    });
    let total = 0;
    if (Array.isArray(count)) {
      total = count.length;
    } else {
      total = count;
    }

    const hasMore = total > page * limit;
    return { data, total, page, limit, hasMore };
  }

  async findAllWithPaginationWithSortAndSearch(
    options?: FindOptions & {
      page?: number;
      limit?: number;
      search?: string;
      sortColumn?: string;
      sortOrder?: string;
      searchableFields?: string[];
    }
  ): Promise<{
    data: T[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      page = 1,
      limit = 10,
      sortColumn,
      sortOrder,
      search = "",
      searchableFields = [],
      where,
      include,
      attributes,
      paranoid,
    } = options || {};

    const offset = (page - 1) * limit;

    const order: Order = this.sortOrder(sortColumn, sortOrder) as Order;
    const finalWhere = {
      ...where,
      ...this.searchedData(search, searchableFields),
    };

    const { rows: data, count: total } = await this.model.findAndCountAll({
      limit,
      offset,
      order,
      where: finalWhere,
      include,
      attributes,
      paranoid,
      distinct: true,
    });

    return { data, total, page: Number(page), limit: Number(page) };
  }

  protected sortOrder(sortColumn?: string, sortOrder?: string) {
    if (!sortColumn && !sortOrder) return undefined;
    return [[sortColumn, sortOrder]];
  }

  protected searchedData(search: string, searchableFields?: string[]) {
    if (!search) return {};
    // const searchableFields = ["firstName", "lastName", "phone", "email"];
    let searchField;
    if (searchableFields?.length) {
      searchField = searchableFields;
    } else {
      searchField = ["firstName", "lastName", "phone", "email"];
    }
    return {
      [Op.or]: searchField?.map((field) => ({
        [field]: { [Op.iLike]: `%${search}%` },
      })),
    };
  }
}
