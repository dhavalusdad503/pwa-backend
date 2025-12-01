import { errorResponse } from "@utils/responseHandler";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { verifyJWTToken as verifyToken } from "@utils/jwt";
import { extractErrorInfo } from "@helper";
import logger from "@utils/logger";

const SECRET_KEY = process.env.JWT_SECRET || "secret";

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
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
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded as { id: string; email: string };
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
    const isValid = verifyJWTTokenHelper(req, res);

    if (!isValid) {
      return;
    }
    return next();
  } catch (error) {
    logger.error("JWT verification failed:", { error });
    return errorResponse(res, "Invalid or expired token", 401);
  }
};
