import { OrgUsersSeeder } from './org-user.seeder';
import { OrganizationSeeder } from './organization.seeder';
import { PatientSeeder } from './patient.seeder';
import { RoleSeeder } from './role.seeder';
import { UserSeeder } from './user.seeder';
import { SeederLogger } from '.';
import AppDataSource from '@config/type-orm/type-orm.config';

export class SeederManager {
  private seeders;

  constructor() {
    this.seeders = [
      new RoleSeeder(),
      new UserSeeder(),
      new OrganizationSeeder(),
      new PatientSeeder(),
      new OrgUsersSeeder(),
    ];
  }

  async runAll(): Promise<void> {
    try {
      SeederLogger.log('Starting database seeding...');

      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
      }
      SeederLogger.log('Database connection established.');

      // Run all seeders
      for (const seeder of this.seeders) {
        await seeder.run(AppDataSource);
      }

      SeederLogger.log('All seeders completed successfully!');
    } catch (error) {
      SeederLogger.error('Seeding failed:', error);
      throw error;
    } finally {
      if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
      }
    }
  }

  async runSpecific(seederName: string): Promise<void> {
    try {
      SeederLogger.log(`Running ${seederName} seeder...`);

      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
      }

      SeederLogger.log('Database connection established.');

      const seeder = this.seeders.find(
        (s) => s.constructor.name === seederName,
      );

      if (!seeder) {
        throw new Error(`Seeder ${seederName} not found`);
      }

      await seeder.run(AppDataSource);
      SeederLogger.log(`${seederName} completed successfully!`);
    } catch (error) {
      SeederLogger.error('Seeding failed:', error);
      throw error;
    } finally {
      if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
      }
    }
  }
}
