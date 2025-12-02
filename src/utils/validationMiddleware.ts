import { extractErrorInfo } from "@/helper/error.helper";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { ObjectSchema } from "joi";

import { errorResponse } from "./responseHandler";

export const validationMiddleware = <T extends ObjectSchema>(
  type: T,
  value: "body" | "query" | "params" | "headers" = "body"
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req[value] = await type.validateAsync(req[value]);
      return next();
    } catch (error) {
      const { message, status } = extractErrorInfo(error, "Validation error");
      return errorResponse(res, message, status);
    }
  };
};
