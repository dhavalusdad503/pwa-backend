import patientService from "@features/patient/patient.service";
import { AuthRequest } from "@middlewares/auth.middleware";
import logger from "@utils/logger";
import { successResponse } from "@utils/responseHandler";
import { Response } from "express";

class PatientController {
  async create(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const visit = await patientService.createPatient({
        ...req.body,
        ...req.user,
      });
      return successResponse(res, visit, "Visit created successfully");
    } catch (error) {
      logger.error("Error creating visit:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default new PatientController();
