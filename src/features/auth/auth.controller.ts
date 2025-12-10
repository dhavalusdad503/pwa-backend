import { AUTH_MESSAGES, STATUS } from "@features/auth/auth.constant";
import { UserService } from "@features/user";
import { extractErrorInfo } from "@helper";
import { decrypt } from "@utils";
import { createJWTToken, verifyJWTToken } from "@utils/jwt";
import logger from "@utils/logger";
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
    } catch (error) {
      logger.error("Error registering user", error);
      const { message, status } = extractErrorInfo(
        error,
        "Internal server error"
      );
      errorResponse(res, message, status);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password, org_id } = req.body;

      if (!email || !password) {
        return errorResponse(res, "Email and password are required", 400);
      }

      const { user, token, refreshToken } = await authService.login({
        email,
        password,
        org_id,
      });

      return successResponse(
        res,
        { token, refreshToken, user },
        "Login successful"
      );
    } catch (error) {
      logger.error("Error logging in user", error);
      const { message, status } = extractErrorInfo(
        error,
        "Internal server error"
      );
      errorResponse(res, message, status);
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
          role: decodedToken?.role,
          role_id: decodedToken?.role_id,
          org_id: decodedToken?.org_id,
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
      logger.error("Error validating refresh token schema", error);
      const { message, status } = extractErrorInfo(
        error,
        "Internal server error"
      );
      errorResponse(res, message, status);
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const user = await UserService.findUserByEmail(email, [
        "id",
        "email",
        "firstName",
        "lastName",
        "status",
      ]);

      if (user.status !== STATUS.ACTIVE) {
        return errorResponse(res, AUTH_MESSAGES.USER_NOT_ACTIVE, 404);
      }

      const { id, email: user_email, firstName, lastName } = user;

      await authService.sendResetPasswordLink({
        id,
        email: user_email,
        firstName,
        lastName,
      });

      return successResponse(
        res,
        null,
        AUTH_MESSAGES.FORGOT_PASSWORD_LINK_SENT
      );
    } catch (error) {
      logger.error("Error in forgotPassword controller", error);
      const { message, status } = extractErrorInfo(
        error,
        "Internal server error"
      );
      return errorResponse(res, message, status);
    }
  }

  async validateToken(req: Request, res: Response) {
    try {
      const { token } = req.query;

      if (!token) {
        return errorResponse(res, AUTH_MESSAGES.INVALID_TOKEN, 400);
      }

      const tokenData = decrypt(token as string);
      const tokenObj = tokenData && JSON.parse(tokenData);

      if (!tokenObj) {
        return errorResponse(res, AUTH_MESSAGES.INVALID_TOKEN, 400);
      }

      const storeToken = await UserService.getResetPasswordTokenUsingUserId({
        user_id: tokenObj?.id,
      });

      if (!storeToken) {
        return errorResponse(res, AUTH_MESSAGES.INVALID_TOKEN, 400);
      }

      const tokenExpiryDate = new Date(tokenObj?.tokenExpiryDate);
      const now = new Date();
      const isValidateToken = now < tokenExpiryDate;

      if (!isValidateToken) {
        return errorResponse(res, AUTH_MESSAGES.INVALID_TOKEN, 400);
      }

      successResponse(res, { isValid: isValidateToken });
    } catch (error) {
      logger.error("Error in validateToken controller", error);
      const { message, status } = extractErrorInfo(
        error,
        "Internal server error"
      );
      return errorResponse(res, message, status);
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { new_password, token } = req.body;

      const user = await authService.resetPassword({
        new_password,
        token: token,
      });

      return successResponse(res, user, AUTH_MESSAGES.PASSWORD_RESET);
    } catch (error) {
      logger.error("Error in resetPassword controller", error);
      const { message, status } = extractErrorInfo(
        error,
        "Internal server error"
      );
      return errorResponse(res, message, status);
    }
  }
}

export default new AuthController();
