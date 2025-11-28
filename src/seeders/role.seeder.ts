import { Roles } from '@enums';
import Role from '../models/roles.model';
import { BaseSeeder } from './base.seeder';
import logger from '@utils/logger';
import { UserRoleSlugs } from '@constants';

export class RoleSeeder extends BaseSeeder {
  constructor() {
    super(Role);
  }

  async run(): Promise<void> {
    try {
      logger.info('Seeding roles...');

      if (await this.exists()) {
        logger.warn('Roles already exist, skipping creation...');
        const existingRoles = await Role.findAll();
        existingRoles.forEach(role => {
          logger.info(`Existing Role: ${role.name}, ID: ${role.id}`);
        });
        return;
      }

      const roles = [
        { name: Roles.CAREGIVER, slug: UserRoleSlugs[Roles.CAREGIVER] },
        { name: Roles.SUPERVISOR, slug: UserRoleSlugs[Roles.SUPERVISOR] },
        { name: Roles.ADMIN, slug: UserRoleSlugs[Roles.ADMIN] },
      ];

      await Role.bulkCreate(roles);

      logger.info('Roles seeded successfully!');
    } catch (error) {
      logger.error('Error seeding roles:', error);
      throw error;
    }
  }
}
