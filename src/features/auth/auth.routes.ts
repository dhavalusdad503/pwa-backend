import { validationMiddleware } from "@utils/validationMiddleware";
import { asyncHandler } from "../../helper/async-handler.helper";
import { BaseRoute } from "../../routes/base.routes";
import authController from "./auth.controller";
import {
  forgotPasswordSchema,
  loginSchema,
  refreshTokenSchema,
  registerSchema,
  resetPasswordSchema,
  validateTokenSchema,
} from "./auth.dto";

export default class AuthRoute extends BaseRoute {
  constructor() {
    super("/auth");
  }

  protected initializeRoutes(): void {
    this.router.post(
      "/register",
      validationMiddleware(registerSchema),
      asyncHandler(authController.register)
    );
    this.router.post(
      "/login",
      validationMiddleware(loginSchema),
      asyncHandler(authController.login)
    );
    this.router.post(
      "/refresh",
      validationMiddleware(refreshTokenSchema),
      asyncHandler(authController.refreshToken)
    );
    this.router.post(
      "/forgot-password",
      validationMiddleware(forgotPasswordSchema),
      asyncHandler(authController.forgotPassword)
    );
    this.router.get(
      "/validate-token",
      validationMiddleware(validateTokenSchema, "query"),
      asyncHandler(authController.validateToken)
    );
    this.router.post(
      "/reset-password",
      validationMiddleware(resetPasswordSchema),
      asyncHandler(authController.resetPassword)
    );
  }
}
