import { PatientRepository } from "@features/patient";
import { extractErrorMessage } from "@helper";
import { Organization, Patient } from "@models";
import { CommonPaginationOptionType, CommonPaginationResponse } from "@types";
import logger from "@utils/logger";
import { Op } from "sequelize";

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
      const { limit = 10, page = 1, sortColumn = 'createdAt', sortOrder = 'DESC', search = '' } = params;
      const offset = (page - 1) * limit;

      const res =
        await this.patientRepository.findAllWithPagination({
          page: page,
          limit: limit,
          offset: offset,
          order: sortColumn && sortOrder ? [[sortColumn, sortOrder]] : [['createdAt', 'DESC']],
          where: { orgId: org_id, name: { [Op.iLike]: `%${search}%` } },
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
        "Error in getAllPatients service"
      );
      throw new Error(message);
    }
  }
}

export default new PatientService();
