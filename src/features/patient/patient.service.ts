import { PatientRepository } from "@features/patient";
import { extractErrorMessage } from "@helper";
import { Organization, Patient } from "@models";
import { CommonPaginationOptionType, CommonPaginationResponse } from "@types";
import logger from "@utils/logger";

class PatientService {
  private patientRepository: typeof PatientRepository;

  constructor() {
    this.patientRepository = PatientRepository;
  }
  async createPatient(patientData: object): Promise<void> {
    await this.patientRepository.create(patientData);
  }

  async getAllPatients(
    org_id: string,
    params: CommonPaginationOptionType
  ): Promise<CommonPaginationResponse<Patient>> {
    try {
      const res =
        await this.patientRepository.findAllWithPaginationWithSortAndSearch({
          ...params,
          attributes: ["id", "name", "primaryAddress"],
          include: [
            {
              model: Organization,
              required: true,
              as: "organization",
              where: { id: org_id },
              attributes: [],
            },
          ],
        });

      return res;
    } catch (error) {
      logger.error("Error in getAllPatients service", error);
      const message = extractErrorMessage(
        error,
        "Error in getAllCaregivers service"
      );
      throw new Error(message);
    }
  }
}

export default new PatientService();
