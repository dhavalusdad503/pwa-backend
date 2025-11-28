import Organization from '../models/organization.model';
import { BaseSeeder } from './base.seeder';
import logger from '@utils/logger';

export class OrganizationSeeder extends BaseSeeder {
  constructor() {
    super(Organization);
  }

  async run(): Promise<void> {
    try {
      logger.info('Seeding organizations...');

      if (await this.exists()) {
        logger.warn('Organizations already exist, skipping creation...');
        return;
      }

      const organizations = [
        { name: 'organization1' },
      ];

      await Organization.bulkCreate(organizations);

      logger.info('Organizations seeded successfully!')
    } catch (error) {
      logger.error('Error seeding organizations:', error);
      throw error;
    }
  }
}
