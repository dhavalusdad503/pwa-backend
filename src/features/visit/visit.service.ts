import { OrgRepository } from "@features/organization";
import { PatientRepository } from "@features/patient";
import { extractErrorMessage } from "@helper";
import { Patient, sequelize } from "@models";
import { Op, Sequelize } from "sequelize";
import Visit from "../../models/visit.model";
import { CreateVisitDto, UpdateVisitDto } from "./visit.dto";
import VisitRepository from "./visit.repository";
import { AuthTokenPayload } from "@features/auth/auth.types";

class VisitService {
  private visitRepository: typeof VisitRepository;
  private patientRepository: typeof PatientRepository;
  private orgRepository: typeof OrgRepository;

  constructor() {
    this.visitRepository = VisitRepository;
    this.patientRepository = PatientRepository;
    this.orgRepository = OrgRepository;
  }

  async createVisit(visitData: CreateVisitDto): Promise<{ id: string }> {
    let createVisitData = {
      caregiverId: visitData.id,
      notes: visitData.notes,
      serviceType: visitData?.serviceType,
      patientId: "",
      startedAt: visitData.startedAt,
      endedAt: visitData.endedAt,
      submittedAt: visitData.submittedAt,
      orgId: "",
    };
    const transaction = await sequelize.transaction();
    try {
      const organization = await this.orgRepository.findOne({
        where: { name: visitData.orgName },
      });

      createVisitData.orgId = organization?.id || " ";

      const findPatient = await this.patientRepository.findPatientByName(
        visitData?.patientName
      );
      if (!findPatient) {
        const createPatient = await this.patientRepository.create(
          {
            name: visitData?.patientName,
            orgId: createVisitData?.orgId,
          },
          { transaction }
        );
        createVisitData.patientId = createPatient?.id;
      } else {
        createVisitData.patientId = findPatient?.id;
      }
      const visit = await this.visitRepository.create(createVisitData, { transaction });
      transaction.commit();
      return { id: visit?.id };
    } catch (error) {
      await transaction.rollback();
      throw new Error(extractErrorMessage(error, "Error in creating Visit"));
    }
  }

  async createManyVisits(visitData: CreateVisitDto[], user: AuthTokenPayload): Promise<{ id: string }[]> {

    const caregiverId = user.id;

    //assuming all visitData belongs to same orgName for single Api call.
    const transaction = await sequelize.transaction();
    try {
      const organization = await this.orgRepository.findOne({
        where: { name: visitData[0].orgName },
      });

      const visits = await Promise.all(
        visitData.map(async (visit) => {
          const findPatient = await this.patientRepository.findPatientByName(
            visit?.patientName
          );

          let patientId;

          if (!findPatient) {
            const createPatient = await this.patientRepository.create(
              {
                name: visit?.patientName,
                orgId: organization?.id,
              },
              { transaction }
            );
            patientId = createPatient?.id;
          } else {
            patientId = findPatient?.id;
          }

          return {
            ...(visit.tempId && { tempId: visit.tempId }),
            caregiverId: caregiverId,
            notes: visit.notes,
            serviceType: visit?.serviceType,
            patientId: patientId,
            startedAt: visit.startedAt,
            endedAt: visit.endedAt,
            submittedAt: visit.submittedAt,
            orgId: organization?.id,
          };
        })
      );

      const result = await this.visitRepository.bulkCreate(visits, { transaction, returning: true });
      transaction.commit();

      return result.map((visit) => ({ id: visit.id, tempId: visit.tempId }));
    } catch (error) {
      await transaction.rollback();
      throw new Error(extractErrorMessage(error, "Error in creating Visit"));
    }
  }

  async getAllVisits(id: string | number): Promise<Visit[]> {
    return await this.visitRepository.findAll({
      attributes: { exclude: ['orgId', 'patientId', 'updatedAt'] },
      where: { caregiverId: id },
      include: [
        {
          model: Patient,
          as: "patient",
        }
      ],
    });
  }

  //visits modified after time
  async getModifiedVisits(userId?: string, time?: string): Promise<Visit[]> {
    return await this.visitRepository.findAll({
      where: {
        ...(time
          ? { updatedAt: { [Op.gt]: time } }
          : { updatedAt: { [Op.ne]: Sequelize.col('createdAt') } }
        ),
        ...(userId && { caregiverId: userId })
      },
      include: [
        {
          model: Patient,
          as: "patient",
          attributes: ['id', 'name'],
        }
      ],
    });
  }

  //visits deleted after time
  async getDeletedVisits(userId?: string, time?: string): Promise<Visit[]> {
    return await this.visitRepository.findAll({
      attributes: ['id'],
      where: {
        deletedAt: { ...(time ? { [Op.gt]: time } : { [Op.not]: null }) },
        ...(userId && { caregiverId: userId })
      },
      paranoid: false,
    });
  }

  async getVisitById(id: string): Promise<Visit | null> {
    return await this.visitRepository.findById(id);
  }

  async updateVisit(id: string, visitData: UpdateVisitDto): Promise<Visit> {
    return await this.visitRepository.update(id, visitData);
  }

  async deleteVisit(id: string): Promise<boolean> {
    return await this.visitRepository.delete(id);
  }

  async getVisitsByOrganization(orgId: string): Promise<Visit[]> {
    return await this.visitRepository.findAll({ where: { orgId } });
  }

  async getVisitsByCaregiver(caregiverId: string): Promise<Visit[]> {
    return await this.visitRepository.findAll({ where: { caregiverId } });
  }

  async getVisitsByPatient(patientId: string): Promise<Visit[]> {
    return await this.visitRepository.findAll({ where: { patientId } });
  }
}

export default new VisitService();
