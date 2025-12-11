import patientService from "@features/patient/patient.service";
import { extractErrorInfo } from "@helper";
import { AuthRequest } from "@middlewares/auth.middleware";
import logger from "@utils/logger";
import { paginationOption } from "@utils/paginationOption";
import { errorResponse, successResponse } from "@utils/responseHandler";
import { Response } from "express";

class PatientController {
  async create(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const visit = await patientService.createPatient({
        ...req.body,
        ...req.user,
      });
      return successResponse(res, visit, "Patient created successfully");
    } catch (error) {
      logger.error("Error in createPatient controller", error);
      const { message, status } = extractErrorInfo(
        error,
        "Internal server error"
      );
      return errorResponse(res, message, status);
    }
  }

  async getAll(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const { org_id } = req.user;
      if (!org_id) {
        return errorResponse(res, "Organization not found", 404);
      }

      const visits = await patientService.getAllPatients(
        org_id,
        paginationOption(req.query)
      );
      return successResponse(res, visits, "Patient fetch successfully");
    } catch (error) {
      logger.error("Error in getAllPatients controller", error);
      return errorResponse(res, "Internal server error", 500);
    }
  }
}

export default new PatientController();
