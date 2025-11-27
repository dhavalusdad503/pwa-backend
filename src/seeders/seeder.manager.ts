import logger from '@utils/logger';
import { sequelize } from '../database/db';
import { BaseSeeder } from './base.seeder';
import { UserSeeder } from './user.seeder';
// import { ProductSeeder } from './product.seeder';

export class SeederManager {
  private seeders: BaseSeeder[];

  constructor() {
    this.seeders = [
      new UserSeeder(),
    ];
  }

  async runAll(): Promise<void> {
    try {
      logger.info('🚀 Starting database seeding...');
      
      // Test database connection
      await sequelize.authenticate();
      logger.info('✅ Database connection established.');

      // Run all seeders
      for (const seeder of this.seeders) {
        await seeder.run();
      }
      
      logger.info('🎉 All seeders completed successfully!');
    } catch (error) {
      logger.error('❌ Seeding failed:', error);
      throw error;
    } finally {
      await sequelize.close();
    }
  }

  async runSpecific(seederName: string): Promise<void> {
    try {
      logger.info(`🚀 Running ${seederName} seeder...`);
      
      await sequelize.authenticate();
      logger.info('✅ Database connection established.');

      const seeder = this.seeders.find(s => s.constructor.name === seederName);
      if (!seeder) {
        throw new Error(`Seeder ${seederName} not found`);
      }

      await seeder.run();
      logger.info(`✅ ${seederName} completed successfully!`);
    } catch (error) {
      logger.error('❌ Seeding failed:', error);
      throw error;
    } finally {
      await sequelize.close();
    }
  }
}