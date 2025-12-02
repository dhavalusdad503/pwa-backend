import { verifyJWTToken } from "@middlewares/auth.middleware";
import { BaseRoute } from "@routes/base.routes";

export default class OrganizationRoute extends BaseRoute {
  constructor() {
    super("/org");
  }
  protected initializeRoutes(): void {
    this.router.use(verifyJWTToken);

    // this.router.get("",verifyJWTToken,asyncHandler(orgController.getAll))
  }
}
