import { Roles } from '@enums';
import logger from '@utils/logger';
import { UserRoleSlugs } from '@constants';
import { RoleRepository } from '@features/roles';

export class RoleSeeder {

  private roleRepository: typeof RoleRepository;

  constructor() {
    this.roleRepository = RoleRepository;
  }

  async run(): Promise<void> {
    try {
      logger.info('Seeding roles...');

      if (await this.roleRepository.dataExists()) {
        logger.warn('Roles already exist, skipping creation...');
        const existingRoles = await this.roleRepository.findAll();
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

      await this.roleRepository.bulkCreate(roles);

      logger.info('Roles seeded successfully!');
    } catch (error) {
      logger.error('Error seeding roles:', error);
      throw error;
    }
  }
}

