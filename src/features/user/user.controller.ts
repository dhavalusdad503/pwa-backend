import { extractErrorInfo } from "@helper";
import { AuthRequest } from "@middlewares/auth.middleware";
import logger from "@utils/logger";
import { paginationOption } from "@utils/paginationOption";
import { Request, Response } from "express";
import { sequelize } from "../../database/db";
import { errorResponse, successResponse } from "../../utils/responseHandler";
import userService from "./user.service";

class UserController {
  async updateUser(req: Request, res: Response) {
    const transaction = await sequelize.transaction();
    try {
      const { name, email } = req.body;
      const { userId } = req.params;

      const updatedUser = await userService.updateUser(+userId, {
        name,
        email,
      });

      await transaction.commit();
      return successResponse(res, updatedUser, "User updated successfully");
    } catch (error: any) {
      await transaction.rollback();
      logger.error("Error in updateUser controller", error);
      const { message, status } = extractErrorInfo(
        error,
        "Internal server error"
      );
      return errorResponse(res, message, status);
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const user = await userService.getUserById(+userId);

      return successResponse(res, user, "User fetched successfully");
    } catch (error: any) {
      logger.error("Error in getUserById controller", error);
      const { message, status } = extractErrorInfo(
        error,
        "Internal server error"
      );
      return errorResponse(res, message, status);
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const deleted = await userService.deleteUser(+userId);

      if (!deleted) {
        return errorResponse(res, "User not found", 404);
      }

      return successResponse(res, null, "User deleted successfully");
    } catch (error: any) {
      logger.error("Error in deleteUser controller", error);
      const { message, status } = extractErrorInfo(
        error,
        "Internal server error"
      );
      return errorResponse(res, message, status);
    }
  }

  async getAll(req: AuthRequest, res: Response) {
    try {
      const { org_id, role } = req.user;

      if (!role) {
        return errorResponse(res, "Unauthorized access", 401);
      }

      if (!org_id) {
        return errorResponse(res, "Organization not found", 404);
      }

      const getAllUsers = await userService.getAllUsers(
        org_id,
        role,
        paginationOption(req.query)
      );
      return successResponse(
        res,
        getAllUsers,
        "User fetch successfully"
      );
    } catch (error: any) {
      logger.error("Error in usersList controller", error);
      return errorResponse(res, "Internal server error", 500);
    }
  }
}

export default new UserController();
