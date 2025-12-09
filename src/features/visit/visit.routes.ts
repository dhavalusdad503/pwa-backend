import { Roles } from "@enums";
import { asyncHandler } from "@helper";
import { verifyJWTToken } from "@middlewares/auth.middleware";
import { roleMiddleware } from "@middlewares/role.middleware";
import { BaseRoute } from "@routes/base.routes";
import visitController from "./visit.controller";

export default class VisitRoute extends BaseRoute {
  constructor() {
    super("/visit");
  }

  protected initializeRoutes(): void {
    this.router.use(verifyJWTToken);

    this.router.post(
      "/create",
      verifyJWTToken,
      // validationMiddleware(createVisitSchema),
      asyncHandler(visitController.create)
    );
    this.router.get("/", verifyJWTToken, asyncHandler(visitController.getAll));
    this.router.get(
      "/list",
      roleMiddleware([Roles.ADMIN, Roles.SUPERVISOR]),
      verifyJWTToken,
      asyncHandler(visitController.getAllVisitsByOrganization)
    );
    // this.router.get("/", verifyJWTToken, asyncHandler(visitController.getAll));
    // this.router.get("/:id", asyncHandler(visitController.getById));
    // this.router.put("/:id", validationMiddleware(updateVisitSchema), asyncHandler(visitController.update));
    // this.router.delete("/:id",  asyncHandler(visitController.delete));
    // this.router.get("/organization/:orgId",  asyncHandler(visitController.getByOrganization));
    // this.router.get("/caregiver/:caregiverId",  asyncHandler(visitController.getByCaregiver));
    // this.router.get("/patient/:patientId", asyncHandler(visitController.getByPatient));
  }
}
