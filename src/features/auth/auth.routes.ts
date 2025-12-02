import { validationMiddleware } from "@utils/validationMiddleware";
import { asyncHandler } from "../../helper/async-handler.helper";
import { BaseRoute } from "../../routes/base.routes";
import authController from "./auth.controller";
import { loginSchema, refreshTokenSchema, registerSchema } from "./auth.dto";

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
      validationMiddleware(refreshTokenSchema, "body"),
      asyncHandler(authController.refreshToken)
    );
  }
}
