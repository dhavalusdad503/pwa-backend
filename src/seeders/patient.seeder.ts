import Patient from '../models/patient.model';
import Organization from '../models/organization.model';
import { BaseSeeder } from './base.seeder';
import logger from '@utils/logger';

export class PatientSeeder extends BaseSeeder {
  constructor() {
    super(Patient);
  }

  async run(): Promise<void> {
    try {
      logger.info('Seeding patients...');

      if (await this.exists()) {
        logger.warn('Patients already exist, skipping creation...');
        return;
      }

      const organization = await Organization.findOne({ where: { name: 'organization1' } });

      if (!organization) {
        logger.error('Organization not found, skipping patients seeding...');
        return;
      }

      const patients = [
        { name: 'patient1', orgId: organization.id },
        { name: 'patient2', orgId: organization.id },
        { name: 'patient3', orgId: organization.id },
      ];

      await Patient.bulkCreate(patients);

      logger.info('Patients seeded successfully!');
    } catch (error) {
      logger.error('Error seeding patients:', error);
      throw error;
    }
  }
}
