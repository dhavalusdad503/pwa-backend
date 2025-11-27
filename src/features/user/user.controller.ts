import { Request, Response } from "express";
import { sequelize } from "../../database/db";
import { errorResponse, successResponse } from "../../utils/responseHandler";
import userService from "./user.service";

class UserController {
  async createUser(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;

      const missingFields = [];
      if (!username) missingFields.push("Username");
      if (!email) missingFields.push("Email");
      if (!password) missingFields.push("Password");

      if (missingFields.length > 0) {
        return errorResponse(
          res,
          `${missingFields.join(", ")} ${
            missingFields.length > 1 ? "are" : "is"
          } required`,
          400
        );
      }

      const newUser = await userService.registerUser({
        name: username,
        email,
        password
      });

      return successResponse(res, newUser, "User created successfully");
    } catch (error: any) {
      return errorResponse(res, error.message || "Error creating user");
    }
  }

  async loginUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const { user, token } = await userService.loginUser(email, password);

      return successResponse(res, { token }, "Login successful");
    } catch (error: any) {
      return errorResponse(res, error.message || "Error logging in user");
    }
  }

  async updateUser(req: Request, res: Response) {
    const transaction = await sequelize.transaction();
    try {
      const { name, email } = req.body;
      const { userId } = req.params;

      const updatedUser = await userService.updateUser(+userId, { name, email });

      await transaction.commit();
      return successResponse(res, updatedUser, "User updated successfully");
    } catch (error: any) {
      await transaction.rollback();
      return errorResponse(res, error.message || "Error updating user");
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const user = await userService.getUserById(+userId);

      return successResponse(res, user, "User fetched successfully");
    } catch (error: any) {
      return errorResponse(res, error.message || "Error fetching user");
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
      return errorResponse(res, error.message || "Error deleting user");
    }
  }

  async test(req: Request, res: Response) {
    try {
      return successResponse(res,null,"test successfully");
    } catch (error: any) {
      return errorResponse(res, error.message || "Error fetching user");
    }
  }
}

export default new UserController();
