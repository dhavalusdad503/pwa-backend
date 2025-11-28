import OrgUser from '../models/org-user.model';
import Organization from '../models/organization.model';
import User from '../models/user.model';
import { BaseSeeder } from './base.seeder';
import logger from '@utils/logger';

export class OrgUserSeeder extends BaseSeeder {
  constructor() {
    super(OrgUser);
  }

  async run(): Promise<void> {
    try {
      logger.info('Seeding organization users...');

      if (await this.exists()) {
        logger.warn('Organization users already exist, skipping creation...');
        return;
      }

      const organization = await Organization.findOne({ where: { name: 'organization1' } });
      if (!organization) {
        logger.error('Organization not found, skipping organization users seeding...');
        return;
      }

      const users = await User.findAll();
      if (users.length === 0) {
        logger.warn('No users found to assign to organization...');
        return;
      }

      const orgUsers = users.map(user => ({
        userId: user.id,
        orgId: organization.id,
      }));

      await OrgUser.bulkCreate(orgUsers);

      logger.info('Organization users seeded successfully!');
    } catch (error) {
      logger.error('Error seeding organization users:', error);
      throw error;
    }
  }
}
