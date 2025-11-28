import Visit from '../../models/visit.model';
import VisitRepository from './visit.repository';
import { CreateVisitDto, UpdateVisitDto } from './visit.dto';

class VisitService {
  private visitRepository: typeof VisitRepository;

  constructor() {
    this.visitRepository = VisitRepository;
  }

  async createVisit(visitData: CreateVisitDto): Promise<Visit> {
    return await this.visitRepository.create(visitData as any);
  }

  async getAllVisits(): Promise<Visit[]> {
    return await this.visitRepository.findAll();
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
