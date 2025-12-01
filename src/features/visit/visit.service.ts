import Visit from "../../models/visit.model";
import { CreateVisitDto, UpdateVisitDto } from "./visit.dto";
import VisitRepository from "./visit.repository";

class VisitService {
  private visitRepository: typeof VisitRepository;

  constructor() {
    this.visitRepository = VisitRepository;
  }

  async createVisit(visitData: CreateVisitDto): Promise<Visit> {
    const CreateVisitData = {
      caregiverId: visitData.id,
      notes: visitData.notes,
      serviceType: visitData?.serviceType.value,
      patientId: visitData.PatientId,
      startedAt: visitData.start_time,
      endedAt: visitData.end_time,
      orgId: visitData.OrgId,
    };
    return await this.visitRepository.create(CreateVisitData);
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
