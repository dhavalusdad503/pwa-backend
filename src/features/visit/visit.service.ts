import { OrgRepository } from "@features/organization";
import { PatientRepository } from "@features/patient";
import { extractErrorMessage } from "@helper";
import { sequelize } from "@models";
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

  async createVisit(visitData: CreateVisitDto): Promise<void> {
    let createVisitData = {
      caregiverId: visitData.id,
      notes: visitData.notes,
      serviceType: visitData?.serviceType.value,
      patientId: "",
      startedAt: visitData.start_time,
      endedAt: visitData.end_time,
      orgId: "",
    };
    const transaction = await sequelize.transaction();
    try {
      const organization = await this.orgRepository.findOne({
        where: { name: visitData.OrgName },
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

      await this.visitRepository.create(createVisitData, { transaction });
      transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw new Error(extractErrorMessage(error, "Error in creating Visit"));
    }
  }

  async getAllVisits(id: string | number): Promise<Visit[]> {
    return await this.visitRepository.findAll({ where: { caregiverId: id } });
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
