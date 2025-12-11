import { Roles } from "@enums";
import { AuthRequest } from "@middlewares/auth.middleware";
import logger from "@utils/logger";
import { paginationOption } from "@utils/paginationOption";
import { errorResponse, successResponse } from "@utils/responseHandler";
import { Request, Response } from "express";
import visitService from "./visit.service";

class VisitController {
  async create(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const visit = await visitService.createVisit({
        ...req.body,
        ...req.user,
      });
      const data = {
        id: visit.id,
      };
      return successResponse(res, data, "Visit created successfully");
    } catch (error) {
      logger.error("Error creating visit:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async createMany(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const visits = await visitService.createManyVisits(req.body, req.user);
      const data = visits;
      return successResponse(res, data, "Visit created successfully");
    } catch (error) {
      logger.error("Error creating visit:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getAll(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const { id, role, org_id } = req.user;

      if (!role) {
        return errorResponse(res, "Unauthorized access", 401);
      }

      if (!org_id) {
        return errorResponse(res, "Organization not found", 404);
      }

      let visits;


      switch (role) {
        case Roles.CAREGIVER:
          visits = await visitService.getAllVisits(id);
          break;
        case Roles.SUPERVISOR:
          visits = await visitService.getAllVisitsByOrganization(
            org_id,
            paginationOption(req.query)
          );
          break;
        case Roles.ADMIN:
          break;
        default:
          return res.status(401).json({ message: "Unauthorized" });
      }

      return successResponse(res, visits, "Visit fetch successfully");
    } catch (error) {
      logger.error("Error fetching visits:", error);
      return errorResponse(res, "Internal server error", 500);
    }
  }


  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const visit = await visitService.getVisitById(id);

      if (!visit) {
        return res.status(404).json({ message: "Visit not found" });
      }

      return res.status(200).json(visit);
    } catch (error) {
      logger.error("Error fetching visit:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getUpdatedVisit(req: Request, res: Response): Promise<Response> {
    try {
      const { after } = req.params;
      const { id } = { id: undefined };
      const unixSeconds = Number(after);     // convert to number
      const utcTimestamp = new Date(unixSeconds * 1000).toISOString();
      if (!utcTimestamp) {
        return res.status(404).json({ message: "Invalid Timestamp" });
      }

      const modifiedVisits = await visitService.getModifiedVisits(id, utcTimestamp);
      const deletedVisits = await visitService.getDeletedVisits(id, utcTimestamp);

      if (!modifiedVisits && !deletedVisits) {
        return res.status(404).json({ message: "Visit not found" });
      }

      return res.status(200).json({ modifiedVisits, deletedVisits });
    } catch (error) {
      logger.error("Error fetching visit:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const visit = await visitService.updateVisit(id, req.body);
      return res.status(200).json(visit);
    } catch (error) {
      logger.error("Error updating visit:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const deleted = await visitService.deleteVisit(id);

      if (!deleted) {
        return res.status(404).json({ message: "Visit not found" });
      }

      return res.status(200).json({ message: "Visit deleted successfully" });
    } catch (error) {
      logger.error("Error deleting visit:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getByOrganization(req: Request, res: Response): Promise<Response> {
    try {
      const { orgId } = req.params;
      const visits = await visitService.getVisitsByOrganization(orgId);
      return res.status(200).json(visits);
    } catch (error) {
      logger.error("Error fetching visits by organization:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getByCaregiver(req: Request, res: Response): Promise<Response> {
    try {
      const { caregiverId } = req.params;
      const visits = await visitService.getVisitsByCaregiver(caregiverId);
      return res.status(200).json(visits);
    } catch (error) {
      logger.error("Error fetching visits by caregiver:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getByPatient(req: Request, res: Response): Promise<Response> {
    try {
      const { patientId } = req.params;
      const visits = await visitService.getVisitsByPatient(patientId);
      return res.status(200).json(visits);
    } catch (error) {
      logger.error("Error fetching visits by patient:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

}

export default new VisitController();
