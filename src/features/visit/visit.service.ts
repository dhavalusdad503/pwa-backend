import { OrgRepository } from "@features/organization";
import { PatientRepository } from "@features/patient";
import { extractErrorMessage } from "@helper";
import { Patient, sequelize } from "@models";
import { CommonPaginationOptionType, CommonPaginationResponse } from "@types";
import logger from "@utils/logger";
import Visit from "../../models/visit.model";
import { CreateVisitDto, UpdateVisitDto } from "./visit.dto";
import VisitRepository from "./visit.repository";

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

      const visit = await this.visitRepository.create(createVisitData, {
        transaction,
      });
      transaction.commit();
      return { id: visit?.id };
    } catch (error) {
      await transaction.rollback();
      throw new Error(extractErrorMessage(error, "Error in creating Visit"));
    }
  }

  async getAllVisits(id: string | number): Promise<Visit[]> {
    return await this.visitRepository.findAll({
      attributes: { exclude: ["orgId", "patientId", "updatedAt"] },
      where: { caregiverId: id },
      include: [
        {
          model: Patient,
          as: "patient",
        },
      ],
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

  async getAllVisitsByOrganization(
    orgId: string,
    params: CommonPaginationOptionType
  ): Promise<CommonPaginationResponse<Visit>> {
    try {
      const res =
        await this.visitRepository.findAllWithPaginationWithSortAndSearch({
          ...params,
          searchableFields: ["serviceType", "notes"],
          where: { orgId },
        });

      return res;
    } catch (error) {
      logger.error("Error in getAllVisitsByOrganization controller", error);
      const message = extractErrorMessage(error, "Internal server error");
      throw new Error(message);
    }
  }
}

export default new VisitService();
