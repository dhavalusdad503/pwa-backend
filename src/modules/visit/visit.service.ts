import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Visit } from './entities/visit.entity';
import {
  Between,
  DataSource,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { Patient } from '../patient/entities/patient.entity';
import { Organization } from '@modules/organization/entities/organization.entity';
import { CreateVisitDto } from './dto/create-visit.dto';
import { UpdateVisitDto } from './dto/update-visit.dto';
import { AuthTokenPayload, CommonPaginationOptionType } from '@common/types';
import moment from 'moment';
import { User } from '@modules/user/entities/user.entity';
import { successResponse } from '@common/utils';
import * as fs from 'fs';

@Injectable()
export class VisitService {
  constructor(
    @InjectRepository(Visit)
    private readonly visitRepository: Repository<Visit>,

    @InjectRepository(Organization)
    private readonly orgRepository: Repository<Organization>,

    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly dataSource: DataSource,
  ) {}

  async createVisit(visitData: CreateVisitDto) {
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
        caregiverId: visitData.id, // Assuming 'id' here is caregiverId
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
      return successResponse(
        {
          id: visit.id,
        },
        'Visit created successfully',
      );
    } catch (error) {
      // Rollback transaction on error
      await queryRunner.rollbackTransaction();
      if (visitData?.path) {
        await fs.promises.unlink(visitData.path);
      }
      throw new Error(`Error creating visit: ${error.message}`);
    }
  }

  async getAllVisits(id: string) {
    const data = await this.visitRepository.find({
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
    return successResponse({ data }, 'Visit fetch successfully');
  }

  async getAllVisitsByOrganization(
    orgId: string,
    params: CommonPaginationOptionType & {
      caregiverId?: string;
      patientId?: string;
      startDate?: string;
      endDate?: string;
    },
  ) {
    const {
      limit = 10,
      page = 1,
      sortColumn = 'createdAt',
      sortOrder = 'DESC',
      search = '',
    } = params;

    const skip = (page - 1) * limit;

    // Build the where clause
    const where: any = { orgId };

    // Dynamic Filters
    if (params.caregiverId) {
      where.caregiverId = params.caregiverId;
    }

    if (params.patientId) {
      where.patientId = params.patientId;
    }

    // Date range filter
    if (params.startDate || params.endDate) {
      const startDateTime = params.startDate
        ? moment(params.startDate).startOf('day').toDate()
        : undefined;
      const endDateTime = params.endDate
        ? moment(params.endDate).endOf('day').toDate()
        : undefined;

      if (startDateTime && endDateTime) {
        where.createdAt = Between(startDateTime, endDateTime);
      } else if (startDateTime) {
        where.createdAt = MoreThanOrEqual(startDateTime);
      } else if (endDateTime) {
        where.createdAt = LessThanOrEqual(endDateTime);
      }
    }

    // Using QueryBuilder for search with OR condition
    const queryBuilder = this.visitRepository
      .createQueryBuilder('visit')
      .leftJoinAndSelect('visit.patient', 'patient')
      .leftJoinAndSelect('visit.caregiver', 'caregiver')
      .where('visit.orgId = :orgId', { orgId })
      .select([
        'visit.id',
        'visit.serviceType',
        'visit.notes',
        'visit.createdAt',
        'visit.updatedAt',
        'visit.orgId',
        // Add other fields you need, excluding caregiverId and patientId
        'patient.id',
        'patient.name',
        'caregiver.id',
        'caregiver.firstName',
        'caregiver.lastName',
      ]);

    // Search filter (OR condition)
    if (search) {
      queryBuilder.andWhere(
        '(visit.serviceType ILIKE :search OR visit.notes ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Apply dynamic filters
    if (params.caregiverId) {
      queryBuilder.andWhere('visit.caregiverId = :caregiverId', {
        caregiverId: params.caregiverId,
      });
    }

    if (params.patientId) {
      queryBuilder.andWhere('visit.patientId = :patientId', {
        patientId: params.patientId,
      });
    }

    // Apply date filters
    if (params.startDate || params.endDate) {
      const startDateTime = params.startDate
        ? moment(params.startDate).startOf('day').toDate()
        : undefined;
      const endDateTime = params.endDate
        ? moment(params.endDate).endOf('day').toDate()
        : undefined;

      if (startDateTime && endDateTime) {
        queryBuilder.andWhere(
          'visit.createdAt BETWEEN :startDate AND :endDate',
          {
            startDate: startDateTime,
            endDate: endDateTime,
          },
        );
      } else if (startDateTime) {
        queryBuilder.andWhere('visit.createdAt >= :startDate', {
          startDate: startDateTime,
        });
      } else if (endDateTime) {
        queryBuilder.andWhere('visit.createdAt <= :endDate', {
          endDate: endDateTime,
        });
      }
    }

    // Sorting
    if (sortColumn && sortOrder) {
      queryBuilder.orderBy(`visit.${sortColumn}`, sortOrder as 'ASC' | 'DESC');
    } else {
      queryBuilder.orderBy('visit.createdAt', 'DESC');
    }

    // Pagination
    const [data, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return successResponse(
      {
        data,
        total,
        page,
        limit,
        hasMore: skip + data.length < total,
      },
      'Visit fetch successfully',
    );
  }

  async createManyVisits(visitData: CreateVisitDto[], user: AuthTokenPayload) {
    try {
      const caregiverId = user.id;

      return await this.dataSource.transaction(async (manager) => {
        // 1️⃣ Find organization
        const organization = await manager.findOne(Organization, {
          where: { name: visitData[0].orgName },
        });

        if (!organization) {
          throw new Error(`Organization "${visitData[0].orgName}" not found`);
        }

        // 2️⃣ Build visit payloads
        const visits = await Promise.all(
          visitData.map(async (visit) => {
            let patient = await manager.findOne(Patient, {
              where: {
                name: visit.patientName,
                orgId: organization.id,
              },
            });

            if (!patient) {
              patient = manager.create(Patient, {
                name: visit.patientName,
                orgId: organization.id,
              });
              await manager.save(patient);
            }

            return {
              ...(visit.tempId && { tempId: visit.tempId }),
              caregiverId,
              notes: visit.notes,
              serviceType: visit.serviceType,
              patientId: patient.id,
              startedAt: visit.startedAt,
              endedAt: visit.endedAt,
              submittedAt: visit.submittedAt,
              orgId: organization.id,
              address: visit.address,
              attestation: visit.attestation,
              followUp: visit.followUp,
              clientPresent: visit.clientPresent,
              safetyCheck: visit.safetyCheck,
              medicationReviewed: visit.medicationReviewed,
              latitude: visit.latitude,
              longitude: visit.longitude,
              filePath: visit.filePath,
              attestationName: visit.attestationName,
            };
          }),
        );

        // 3️⃣ BULK INSERT
        const insertResult = await manager.insert(Visit, visits);

        // 4️⃣ Map inserted IDs with tempId
        return insertResult.identifiers.map((idObj, index) => ({
          id: idObj.id,
          tempId: visits[index]?.tempId ?? null,
        }));
      });
    } catch (error) {
      // ALWAYS rethrow or transform
      throw new Error(`Error creating visit: ${error.message}`);
    }
  }

  //visits modified after time
  async getModifiedVisits(userId?: string, time?: string): Promise<Visit[]> {
    const qb = this.visitRepository
      .createQueryBuilder('visit')
      .leftJoinAndSelect('visit.patient', 'patient')
      .select(['visit', 'patient.id', 'patient.name']);

    if (time) {
      qb.andWhere('visit.updatedAt > :time', { time });
    } else {
      qb.andWhere('visit.updatedAt != visit.createdAt');
    }

    if (userId) {
      qb.andWhere('visit.caregiverId = :userId', { userId });
    }

    return await qb.getMany();
  }

  //visits deleted after time
  async getDeletedVisits(userId?: string, time?: string): Promise<Visit[]> {
    const qb = this.visitRepository
      .createQueryBuilder('visit')
      .withDeleted() // 👈 equivalent of paranoid: false
      .select(['visit.id']);

    if (time) {
      qb.andWhere('visit.deletedAt > :time', { time });
    } else {
      qb.andWhere('visit.deletedAt IS NOT NULL');
    }

    if (userId) {
      qb.andWhere('visit.caregiverId = :userId', { userId });
    }

    return await qb.getMany();
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
