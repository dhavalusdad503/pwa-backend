import { DataSource } from 'typeorm';
import { Seeder } from './seeder.interface';
import { OrgUser } from '@/modules/org-user/entities/org-user.entity';
import { Organization } from '@/modules/organization/entities/organization.entity';
import { User } from '@/modules/user/entities/user.entity';
import { DEFAULT_ORGANIZATION_NAME } from '@/common/constants';

export class OrgUsersSeeder implements Seeder {
  name = 'OrgUsersSeeder';

  async run(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      console.log('Seeding organization users...');

      const orgUserRepository = queryRunner.manager.getRepository(OrgUser);
      const organizationRepository =
        queryRunner.manager.getRepository(Organization);
      const userRepository = queryRunner.manager.getRepository(User);
      const organizationList = await orgUserRepository.count();

      if (organizationList > 0) {
        console.log('Organization users already exist, skipping creation...');
        return;
      }
      const organization = await organizationRepository.findOne({
        where: { name: DEFAULT_ORGANIZATION_NAME },
      });

      if (!organization) {
        console.log(
          'Organization not found, skipping organization users seeding...',
        );
        return;
      }

      const users = await userRepository.find();
      if (users.length === 0) {
        console.log('No users found to assign to organization...');
        return;
      }

      const orgUsers = users.map((user) => ({
        userId: user.id,
        orgId: organization.id,
      }));

      await orgUserRepository.save(orgUsers);
      await queryRunner.commitTransaction();
      console.log('Organization users seeded successfully!');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log('Error seeding organization users:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
