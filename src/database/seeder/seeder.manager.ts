import AppDataSource from '@/config/type-orm/type-orm.config';
import { OrgUsersSeeder } from './org-user.seeder';
import { OrganizationSeeder } from './organization.seeder';
import { PatientSeeder } from './patient.seeder';
import { RoleSeeder } from './role.seeder';
import { UserSeeder } from './user.seeder';

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
      console.log('Starting database seeding...');

      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
      }
      console.log('Database connection established.');

      // Run all seeders
      for (const seeder of this.seeders) {
        await seeder.run(AppDataSource);
      }

      console.log('All seeders completed successfully!');
    } catch (error) {
      console.log('Seeding failed:', error);
      throw error;
    } finally {
      if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
      }
    }
  }

  async runSpecific(seederName: string): Promise<void> {
    try {
      console.log(`Running ${seederName} seeder...`);

      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
      }

      console.log('Database connection established.');

      const seeder = this.seeders.find(
        (s) => s.constructor.name === seederName,
      );

      if (!seeder) {
        throw new Error(`Seeder ${seederName} not found`);
      }

      await seeder.run(AppDataSource);
      console.log(`${seederName} completed successfully!`);
    } catch (error) {
      console.log('Seeding failed:', error);
      throw error;
    } finally {
      if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
      }
    }
  }
}
