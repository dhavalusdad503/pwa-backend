import { Roles } from "@enums";
import { verifyJWTToken } from "@middlewares/auth.middleware";
import { roleMiddleware } from "@middlewares/role.middleware";
import { asyncHandler } from "../../helper/async-handler.helper";
import { BaseRoute } from "../../routes/base.routes";
import userController from "./user.controller";

export default class UserRoute extends BaseRoute {
  constructor() {
    super("/user");
  }

  protected initializeRoutes(): void {
    this.router.get(
      "/",
      roleMiddleware([Roles.ADMIN, Roles.SUPERVISOR]),
      verifyJWTToken,
      asyncHandler(userController.getAll)
    );
    // this.router.put("/:userId", asyncHandler(userController.updateUser));
    // this.router.get("/:userId", asyncHandler(userController.getUserById));
    // this.router.delete("/:userId", asyncHandler(userController.deleteUser));
  }
}
