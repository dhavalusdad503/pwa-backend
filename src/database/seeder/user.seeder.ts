import { DataSource } from 'typeorm';
import { Seeder } from './seeder.interface';
import { Role } from '@/modules/roles/entities/role.entity';
import { User } from '@/modules/user/entities/user.entity';
import { Roles, UserRoleSlugs, UserStatus } from '@/common/constants';
import bcrypt from 'bcrypt';
import { SeederLogger } from '.';

export class UserSeeder implements Seeder {
  name = 'UserSeeder';

  async run(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      SeederLogger.log('Seeding users...');
      const roleRepository = queryRunner.manager.getRepository(Role);
      const userRepository = queryRunner.manager.getRepository(User);
      const userCount = await userRepository.count();

      if (userCount > 0) {
        SeederLogger.log('Users already exist, skipping creation...');
        return;
      }

      const roles = await roleRepository.find();
      const adminRole = roles.find(
        (role) => role.slug === UserRoleSlugs[Roles.ADMIN],
      );
      const supervisorRole = roles.find(
        (role) => role.slug === UserRoleSlugs[Roles.SUPERVISOR],
      );
      const caregiverRole = roles.find(
        (role) => role.slug === UserRoleSlugs[Roles.CAREGIVER],
      );

      if (!adminRole || !supervisorRole || !caregiverRole) {
        SeederLogger.log('Required roles not found, skipping users seeding...');
        return;
      }

      const users = [
        {
          firstName: 'Admin',
          lastName: 'Admin',
          email: 'admin@yopmail.com',
          roleId: adminRole?.id,
          status: UserStatus.ACTIVE,
          password: await bcrypt.hash('Admin@123', 10),
        },

        {
          firstName: 'Super',
          lastName: 'Visor',
          email: 'SuperVisor@yopmail.com',
          roleId: supervisorRole?.id,
          status: UserStatus.ACTIVE,
          password: await bcrypt.hash('Supervisor@123', 10),
        },
        {
          firstName: 'Caregiver',
          lastName: 'User',
          email: 'user@yopmail.com',
          roleId: caregiverRole?.id,
          status: UserStatus.ACTIVE,
          password: await bcrypt.hash('Caregiver@123', 10),
        },
      ];

      await userRepository.save(users);
      await queryRunner.commitTransaction();

      SeederLogger.log('Users seeded successfully!');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      SeederLogger.error('Error seeding users:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
