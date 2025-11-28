import bcrypt from 'bcrypt';
import User from '../models/user.model';
import { BaseSeeder } from './base.seeder';
import logger from '@utils/logger';
import Role from '@models/roles.model';
import { AuthProvider, Roles, UserStatus } from '@enums';

export class UserSeeder extends BaseSeeder {
  constructor() {
    super(User);
  }

  async run(): Promise<void> {
    try {
      logger.info('🌱 Seeding users...');

      if (await this.exists()) {
        logger.warn('⚠️  Users already exist, skipping...');
        return;
      }

      const roles = await Role.findAll();
      const superRole = roles.find(role => role.name === Roles.SUPER);
      const adminRole = roles.find(role => role.name === Roles.ADMIN);
      const userRole = roles.find(role => role.name === Roles.USER);

      if(!superRole || !adminRole || !userRole) {
        logger.error('❌ Roles not found, skipping users seeding...');
        return;
      }

      const users = [
        {
          firstName: 'Admin1',
          lastName: 'Admin1',
          email: 'admin1@yopmail.com',
          roleId: superRole?.id,
          status: UserStatus.ACTIVE,
          authProvider: AuthProvider.EMAIL,
          password: await bcrypt.hash('admin@123', 10),
        },
        {
          firstName: 'User1',
          lastName: 'User1',
          email: 'user1@yopmail.com',
          roleId: userRole?.id,
          status: UserStatus.ACTIVE,
          authProvider: AuthProvider.EMAIL,
          password: await bcrypt.hash('user@123', 10),
        },
      ];

      await User.bulkCreate(users);
      logger.info('✅ Users seeded successfully!');
    } catch (error) {
      logger.error('❌ Error seeding users:', error);
      throw error;
    }
  }
}