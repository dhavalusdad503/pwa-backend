import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Visit } from './entities/visit.entity';
import { DataSource, Repository } from 'typeorm';
import { Organization } from '../organization/entities/organization.entity';
import { Patient } from '../patient/entities/patient.entity';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';

@Injectable()
export class VisitService {
  constructor(
    @InjectRepository(Visit)
    private readonly visitRepository: Repository<Visit>,

    @InjectRepository(Organization)
    private readonly orgRepository: Repository<Organization>,

    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,

    private readonly dataSource: DataSource,
  ) {}

  async createVisit(visitData: CreateVisitDto): Promise<{ id: string }> {
    // Start a TypeORM transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Find organization by name
      const organization = await queryRunner.manager.findOne(Organization, {
        where: { name: visitData.orgName },
      });

      if (!organization) {
        throw new Error(`Organization "${visitData.orgName}" not found`);
      }

      // Find or create patient
      let patient = await queryRunner.manager.findOne(Patient, {
        where: { name: visitData.patientName, orgId: organization.id },
      });

      if (!patient) {
        patient = queryRunner.manager.create(Patient, {
          name: visitData.patientName,
          orgId: organization.id,
        });
        await queryRunner.manager.save(Patient, patient);
      }

      // Create visit
      const visit = queryRunner.manager.create(Visit, {
        startedAt: visitData.startedAt,
        endedAt: visitData.endedAt,
        caregiverId: 'a76010a0-05db-48bd-82e2-82dcc74b6637', // Assuming 'id' here is caregiverId
        notes: visitData.notes,
        serviceType: visitData.serviceType,
        patientId: patient.id,
        submittedAt: visitData.submittedAt,
        orgId: organization.id,
        address: visitData.address,
        attestation: visitData.attestation,
        followUp: visitData.followUp,
        clientPresent: visitData.clientPresent,
        safetyCheck: visitData.safetyCheck,
        medicationReviewed: visitData.medicationReviewed,
        latitude: visitData.latitude,
        longitude: visitData.longitude,
        filePath: visitData.filePath,
        attestationName: visitData.attestationName,
      });

      await queryRunner.manager.save(Visit, visit);

      // Commit transaction
      await queryRunner.commitTransaction();
      return { id: visit.id };
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      throw new Error(`Error creating visit: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async getAllVisits(id: string): Promise<Visit[]> {
    return this.visitRepository.find({
      where: { caregiverId: id },
      relations: {
        patient: true, // relation defined in Visit entity
      },
      select: {
        // select all except orgId, patientId, updatedAt
        id: true,
        caregiverId: true,
        startedAt: true,
        endedAt: true,
        notes: true,
        serviceType: true,
        submittedAt: true,
        // address: true,
        attestation: true,
        followUp: true,
        clientPresent: true,
        safetyCheck: true,
        medicationReviewed: true,
        latitude: true,
        longitude: true,
        // filePath: true,
        attestationName: true,
        // createdAt: true,
        // exclude: orgId, patientId, updatedAt
        patient: {
          id: true,
          name: true,
          primaryAddress: true,
          createdAt: true,
        },
      },
    });
  }
  getAllVisitsByOrganization() {
    return [];
  }
  findOne(id: number) {
    return `This action returns a #${id} visit`;
  }

  update(id: number, updateVisitDto: UpdateVisitDto) {
    return `This action updates a #${id} visit`;
  }

  remove(id: number) {
    return `This action removes a #${id} visit`;
  }
}
