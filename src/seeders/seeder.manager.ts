import logger from "@utils/logger";
import { sequelize } from "../database/db";
import { UserSeeder } from "./user.seeder";
// import { ProductSeeder } from './product.seeder';

import { QueryTypes } from "sequelize";
import { OrgUserSeeder } from "./org-user.seeder";
import { OrganizationSeeder } from "./organization.seeder";
import { PatientSeeder } from "./patient.seeder";
import { RoleSeeder } from "./role.seeder";

export class SeederManager {
  private seeders;

  constructor() {
    this.seeders = [
      new RoleSeeder(),
      new UserSeeder(),
      new OrganizationSeeder(),
      new PatientSeeder(),
      new OrgUserSeeder(),
    ];
  }

  async hasRun(seederName: string) {
    const result = await sequelize.query(
      `SELECT name FROM "SequelizeData" WHERE name = :name`,
      { replacements: { name: seederName }, type: QueryTypes.SELECT }
    );
    return result.length > 0;
  }

  async markAsRun(seederName: string) {
    await sequelize.query(`INSERT INTO "SequelizeData"(name) VALUES(:name)`, {
      replacements: { name: seederName },
    });
  }

  async runAll(): Promise<void> {
    try {
      logger.info("Starting database seeding...");

      // Test database connection
      await sequelize.authenticate();
      logger.info("Database connection established.");

      // Run all seeders
      for (const seeder of this.seeders) {
        const seederName = seeder.constructor.name;
        const alreadyRan = await this.hasRun(seederName);
        if (alreadyRan) {
          logger.info(`${seederName} already executed`);
          continue;
        }

        await seeder.run();

        await this.markAsRun(seederName);
        logger.info(`${seederName} completed successfully!`);
      }

      logger.info("All seeders completed successfully!");
    } catch (error) {
      logger.error("Seeding failed:", error);
      throw error;
    } finally {
      await sequelize.close();
    }
  }

  async runSpecific(seederName: string): Promise<void> {
    try {
      logger.info(`Running ${seederName} seeder...`);

      await sequelize.authenticate();
      logger.info("Database connection established.");

      const seeder = this.seeders.find(
        (s) => s.constructor.name === seederName
      );
      if (!seeder) {
        throw new Error(`Seeder ${seederName} not found`);
      }

      const alreadyRan = await this.hasRun(seederName);
      if (alreadyRan) {
        logger.info(`${seederName} already executed`);
        return;
      }

      await seeder.run();
      await this.markAsRun(seederName);
      logger.info(`${seederName} completed successfully!`);
    } catch (error) {
      logger.error("Seeding failed:", error);
      throw error;
    } finally {
      await sequelize.close();
    }
  }
}
