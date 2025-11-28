import logger from '@utils/logger';
import { OrgUserRepository } from '@features/org-user';
import { OrganizationRepository } from '@features/organization';
import { UserRepository } from '@features/user';

export class OrgUserSeeder {

  private orgUserRepository: typeof OrgUserRepository;
  private organizationRepository: typeof OrganizationRepository;
  private userRepository: typeof UserRepository;

  constructor() {
    this.orgUserRepository = OrgUserRepository;
    this.organizationRepository = OrganizationRepository;
    this.userRepository = UserRepository;
  }

  async run(): Promise<void> {
    try {
      logger.info('Seeding organization users...');

      if (await this.orgUserRepository.dataExists()) {
        logger.warn('Organization users already exist, skipping creation...');
        return;
      }

      const organization = await this.organizationRepository.findByName('organization1');
      if (!organization) {
        logger.error('Organization not found, skipping organization users seeding...');
        return;
      }

      const users = await this.userRepository.findAll();
      if (users.length === 0) {
        logger.warn('No users found to assign to organization...');
        return;
      }

      const orgUsers = users.map(user => ({
        userId: user.id,
        orgId: organization.id,
      }));

      await this.orgUserRepository.bulkCreate(orgUsers);

      logger.info('Organization users seeded successfully!');
    } catch (error) {
      logger.error('Error seeding organization users:', error);
      throw error;
    }
  }
}

