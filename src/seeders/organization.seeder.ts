import logger from '@utils/logger';
import { OrganizationRepository } from '@features/organization';

export class OrganizationSeeder {

  private organizationRepository: typeof OrganizationRepository;

  constructor() {
    this.organizationRepository = OrganizationRepository;
  }

  async run(): Promise<void> {
    try {
      logger.info('Seeding organizations...');

      if (await this.organizationRepository.dataExists()) {
        logger.warn('Organizations already exist, skipping creation...');
        return;
      }

      const organizations = [
        { name: 'organization1' },
      ];

      await this.organizationRepository.bulkCreate(organizations);

      logger.info('Organizations seeded successfully!');
    } catch (error) {
      logger.error('Error seeding organizations:', error);
      throw error;
    }
  }
}

