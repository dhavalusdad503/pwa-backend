import { DataSource } from 'typeorm';
import { Seeder } from './seeder.interface';
import { Role } from '@/modules/roles/entities/role.entity';
import { Roles, UserRoleSlugs } from '@/common/constants';

export class RoleSeeder implements Seeder {
  name = 'RoleSeeder';

  async run(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      console.log('Seeding roles...');
      const roleRepository = queryRunner.manager.getRepository(Role);
      const roleCount = await roleRepository.count();

      if (roleCount > 0) {
        console.log('Roles already exist, skipping creation...');
        return;
      }
      const defaultRoles = [
        {
          name: Roles.ADMIN,
          slug: UserRoleSlugs[Roles.ADMIN],
        },
        {
          name: Roles.SUPERVISOR,
          slug: UserRoleSlugs[Roles.SUPERVISOR],
        },
        {
          name: Roles.CAREGIVER,
          slug: UserRoleSlugs[Roles.CAREGIVER],
        },
      ];

      await roleRepository.save(defaultRoles);
      await queryRunner.commitTransaction();

      console.log('Roles seeded successfully!');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log('Error seeding roles:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
