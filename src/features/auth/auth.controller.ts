import { extractErrorInfo } from "@helper";
import { createJWTToken, verifyJWTToken } from "@utils/jwt";
import { Request, Response } from "express";
import { errorResponse, successResponse } from "../../utils/responseHandler";
import authService from "./auth.service";

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { firstName, lastName, email, password, phone } = req.body;

      const missingFields = [];
      if (!firstName) missingFields.push("First Name");
      if (!lastName) missingFields.push("Last Name");
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

      const newUser = await authService.register({
        firstName,
        lastName,
        email,
        password,
        phone,
      });

      return successResponse(res, newUser, "User registered successfully");
    } catch (error: any) {
      return errorResponse(res, error.message || "Error registering user");
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return errorResponse(res, "Email and password are required", 400);
      }

      const { user, token, refreshToken } = await authService.login({
        email,
        password,
      });

      return successResponse(
        res,
        { token, refreshToken, user },
        "Login successful"
      );
    } catch (error: any) {
      return errorResponse(res, error.message || "Error logging in");
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      const decodedToken = verifyJWTToken(refreshToken);

      if (decodedToken && decodedToken?.id) {
        const tokenPayload = {
          id: decodedToken?.id,
          email: decodedToken?.email,
        };

        const token = createJWTToken(tokenPayload);

        successResponse(
          res,
          {
            token,
            refreshToken: refreshToken,
          },
          "Access token generated successfully"
        );
      }
    } catch (error) {
      const { message, status } = extractErrorInfo(
        error,
        "Error validating refresh token schema"
      );
      errorResponse(res, message, status);
    }
  }
}

export default new AuthController();
