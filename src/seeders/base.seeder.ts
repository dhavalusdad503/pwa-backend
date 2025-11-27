import { Model, ModelStatic } from "sequelize";

export abstract class BaseSeeder {
  protected model: ModelStatic<Model>;

  constructor(model: ModelStatic<Model>) {
    this.model = model;
  }

  abstract run(): Promise<void>;

  protected async clear(): Promise<void> {
    await this.model.destroy({ where: {} });
  }

  protected async exists(): Promise<boolean> {
    const count = await this.model.count();
    return count > 0;
  }
}
