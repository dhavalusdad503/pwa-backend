import { DataSource } from 'typeorm';
import { Seeder } from './seeder.interface';
import { Organization } from '@/modules/organization/entities/organization.entity';
import { DEFAULT_ORGANIZATION_NAME } from '@/common/constants';
import { SeederLogger } from '.';

export class OrganizationSeeder implements Seeder {
  name = 'OrganizationSeeder';

  async run(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      SeederLogger.log('Seeding organizations...');

      const organizationRepository =
        queryRunner.manager.getRepository(Organization);
      const organizationCount = await organizationRepository.count();

      if (organizationCount > 0) {
        SeederLogger.log('Organizations already exist, skipping creation...');
        return;
      }

      const defaultOrganization = [{ name: DEFAULT_ORGANIZATION_NAME }];
      await organizationRepository.save(defaultOrganization);
      await queryRunner.commitTransaction();

      SeederLogger.log('Organizations seeded successfully!');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      SeederLogger.error('Error seeding organizations:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
