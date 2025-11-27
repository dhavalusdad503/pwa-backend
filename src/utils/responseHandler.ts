import { Response } from "express";

/**
 * Sends a success response.
 * @param res - Express Response object
 * @param data - Response data
 * @param message - Optional success message
 * @param statusCode - HTTP status code (default: 200)
 */
export const successResponse = (
  res: Response,
  data: any,
  message: string = "Success",
  statusCode: number = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Sends an error response.
 * @param res - Express Response object
 * @param error - Error message or object
 * @param statusCode - HTTP status code (default: 500)
 */
export const errorResponse = (
  res: Response,
  error: any,
  statusCode: number = 500
) => {
  return res.status(statusCode).json({
    success: false,
    message: typeof error === "string" ? error : error.message || "Error",
  });
};
