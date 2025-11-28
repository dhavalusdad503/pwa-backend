import logger from '@utils/logger';
import { PatientRepository } from '@features/patient';
import { OrganizationRepository } from '@features/organization';

export class PatientSeeder {

  private patientRepository: typeof PatientRepository;
  private organizationRepository: typeof OrganizationRepository;

  constructor() {
    this.patientRepository = PatientRepository;
    this.organizationRepository = OrganizationRepository;
  }

  async run(): Promise<void> {
    try {
      logger.info('Seeding patients...');

      if (await this.patientRepository.dataExists()) {
        logger.warn('Patients already exist, skipping creation...');
        return;
      }

      const organization = await this.organizationRepository.findByName('organization1');

      if (!organization) {
        logger.error('Organization not found, skipping patients seeding...');
        return;
      }

      const patients = [
        { name: 'patient1', orgId: organization.id },
        { name: 'patient2', orgId: organization.id },
        { name: 'patient3', orgId: organization.id },
      ];

      await this.patientRepository.bulkCreate(patients);

      logger.info('Patients seeded successfully!');
    } catch (error) {
      logger.error('Error seeding patients:', error);
      throw error;
    }
  }
}

