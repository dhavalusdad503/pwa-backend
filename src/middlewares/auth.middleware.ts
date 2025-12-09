import { ENV_CONFIG } from "@config/envConfig";
import { AuthTokenPayload } from "@features/auth/auth.types";
import { extractErrorInfo } from "@helper";
import { verifyJWTToken as verifyToken } from "@utils/jwt";
import logger from "@utils/logger";
import { errorResponse } from "@utils/responseHandler";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user: AuthTokenPayload;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, ENV_CONFIG.JWT_SECRET_KEY);
    req.user = decoded as AuthTokenPayload;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
    return;
  }
};
export const verifyJWTTokenHelper = (req: AuthRequest, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      errorResponse(res, "Access token is required", 401);
      return false;
    }

    const token = authHeader.substring(7);

    const decoded = verifyToken(token);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      role_id: decoded.role_id,
      org_id: decoded.org_id,
    };

    return req;
  } catch (error) {
    const { message } = extractErrorInfo(
      error,
      "Error in verifyJWTTokenHelper"
    );
    throw new Error(message);
  }
};

export const verifyJWTToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const isValid = verifyJWTTokenHelper(req as AuthRequest, res);

    if (!isValid) {
      return;
    }
    return next();
  } catch (error) {
    logger.error("JWT verification failed:", { error });
    return errorResponse(res, "Invalid or expired token", 401);
  }
};
