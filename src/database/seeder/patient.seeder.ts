import { DataSource } from 'typeorm';
import { Seeder } from './seeder.interface';
import { SeederLogger } from '.';
import { Patient } from '@modules/patient/entities/patient.entity';
import { Organization } from '@modules/organization/entities/organization.entity';
import { DEFAULT_ORGANIZATION_NAME } from '@common/constants';

export class PatientSeeder implements Seeder {
  name = 'PatientSeeder';

  async run(dataSource: DataSource): Promise<void> {
    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      SeederLogger.log('Seeding patients...');
      const patientRepository = queryRunner.manager.getRepository(Patient);
      const organizationRepository =
        queryRunner.manager.getRepository(Organization);
      const patientCount = await patientRepository.count();

      if (patientCount > 0) {
        SeederLogger.log('Patients already exist, skipping creation...');
        return;
      }

      const organization = await organizationRepository.findOne({
        where: { name: DEFAULT_ORGANIZATION_NAME },
      });

      if (!organization) {
        SeederLogger.log(
          'Organization not found, skipping patients seeding...',
        );
        return;
      }

      const defaultPatients = [
        { name: 'John Doe', orgId: organization.id },
        { name: 'Mary Smith', orgId: organization.id },
        { name: 'Bob Johnson', orgId: organization.id },
      ];

      await patientRepository.save(defaultPatients);
      await queryRunner.commitTransaction();

      SeederLogger.log('Patients seeded successfully!');
    } catch (error) {
      await queryRunner.rollbackTransaction();
      SeederLogger.error('Error seeding patients:', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
