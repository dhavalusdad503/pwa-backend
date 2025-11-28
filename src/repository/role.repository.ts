import { Role } from "@models";
import { BaseRepository } from "./base.repository";

export interface IRoleRepository {
  //   findById(id: string): Promise<Role | null>;
}

class RoleRepository extends BaseRepository<Role> {
  constructor() {
    super(Role);
  }

  //   async findById(id: string | number): Promise<Role | null> {
  //     return await this.findById(id);
  //   }
}

export default new RoleRepository();
