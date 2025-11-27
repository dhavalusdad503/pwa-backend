import bcrypt from 'bcrypt';
import User from '../models/user.model';
import { BaseSeeder } from './base.seeder';
import logger from '@utils/logger';

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

      const users = [
        {
          name: 'John Doe',
          email: 'john@example.com',
          password: await bcrypt.hash('password123', 10),
        },
        {
          name: 'Jane Smith',
          email: 'jane@example.com',
          password: await bcrypt.hash('password123', 10),
        },
        {
          name: 'Admin User',
          email: 'admin@example.com',
          password: await bcrypt.hash('admin123', 10),
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