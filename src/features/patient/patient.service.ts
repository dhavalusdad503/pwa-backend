import { PatientRepository } from "@features/patient";

class PatientService {
  private patientRepository: typeof PatientRepository;

  constructor() {
    this.patientRepository = PatientRepository;
  }
  async createPatient(patientData: object): Promise<void> {
    await this.patientRepository.create(patientData);
  }
}

export default new PatientService();
